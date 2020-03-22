import xmlParser from "fast-xml-parser";
import queryString from "query-string";

import HttpsRequester from "./utils/HttpsRequester";

import {
  convertToHiragana,
  getNumberFromChar,
  isCharHiragana,
  isCharKanji,
  isCharKatakana
} from "@common/japanese";
import { JapaneseTextFragment } from "@common/japaneseMarkup";

interface MAParseWord {
  surface: string;
  reading: string | number;
  pos: string;
  baseform: string;
}

interface MAParseResult {
  ResultSet: {
    ma_result: {
      filtered_count: number;
      total_count: number;
      word_list: {
        word: ReadonlyArray<MAParseWord>;
      };
    };
  };
}

interface ReadingChunk {
  surface: string;
  reading: string;
}

enum StringComposition {
  KanjiOnly,
  KanaOnly,
  BothKanjiAndKana,
  Other
}

function getStringComposition(str: string): StringComposition {
  let hasKanji = false;
  let hasKana = false;

  for (const char of str) {
    if (!hasKanji && isCharKanji(char)) {
      hasKanji = true;
    }

    if (!hasKana && (isCharHiragana(char) || isCharKatakana(char))) {
      hasKana = true;
    }

    if (hasKana && hasKanji) {
      break;
    }
  }

  if (hasKanji && hasKana) {
    return StringComposition.BothKanjiAndKana;
  }

  if (hasKanji) {
    return StringComposition.KanjiOnly;
  }

  if (hasKana) {
    return StringComposition.KanaOnly;
  }

  return StringComposition.Other;
}

/**
 * This function will comb through all of the words the list and split
 * any word that is complex into smaller pieces. For most words, this
 * will just be an identity operation. However, for words that have
 * a mixture of Kanji and Kana (ie, 書き込む) this will split it out into
 * smaller pieces (ie, ['書', 'き', '込', 'む']).
 */
function splitWordListOnReadings(
  words: ReadonlyArray<MAParseWord>
): ReadonlyArray<ReadingChunk> {
  const chunks: ReadingChunk[] = [];

  for (const word of words) {
    const composition = getStringComposition(word.surface);
    if (composition !== StringComposition.BothKanjiAndKana) {
      chunks.push({
        reading: word.reading.toString(),
        surface: word.surface
      });
      continue;
    }

    const regexPatternChunks: string[] = [];
    const runs: Array<{
      isKanji: boolean;
      text: string;
    }> = [];
    let wasLastCharKanji = false;
    for (const char of word.surface) {
      if (isCharKanji(char)) {
        if (!wasLastCharKanji) {
          wasLastCharKanji = true;
          regexPatternChunks.push("(.*)");
          runs.push({ isKanji: true, text: char });
        } else {
          runs[runs.length - 1].text += char;
        }
      } else {
        regexPatternChunks.push(
          isCharKatakana(char) ? convertToHiragana(char) : char
        );

        if (wasLastCharKanji || !runs.length) {
          wasLastCharKanji = false;
          runs.push({ isKanji: false, text: char });
        } else {
          runs[runs.length - 1].text += char;
        }
      }
    }

    const regularExpression = new RegExp(`^${regexPatternChunks.join("")}$`);
    const matches = convertToHiragana(word.reading.toString()).match(
      regularExpression
    );

    if (!matches) {
      chunks.push({
        reading: word.reading.toString(),
        surface: word.surface
      });
      continue;
    }

    let nextRegexGroupIndex = 1;
    for (const run of runs) {
      if (run.isKanji) {
        chunks.push({
          reading: matches[nextRegexGroupIndex],
          surface: run.text
        });
        nextRegexGroupIndex++;
      } else {
        chunks.push({
          reading: convertToHiragana(run.text),
          surface: run.text
        });
      }
    }
  }

  return chunks;
}

function areSurfaceAndReadingEqual(surface: string, reading: string): boolean {
  if (surface === reading) {
    return true;
  }

  // If both strings are the same length, check to see if they're
  // the same but in different syllabaries.
  if (surface.length === reading.length) {
    // If both the surface and the reading are numbers, check to see if they're
    // equal that way. This will account for full width/half width/ASCII digits.
    let wereInputsNumeric = true;
    for (let index = 0; index < surface.length; ++index) {
      const surfaceDigit = getNumberFromChar(surface[index]);
      const readingDigit = getNumberFromChar(reading[index]);
      if (isNaN(surfaceDigit) || isNaN(readingDigit)) {
        wereInputsNumeric = false;
        break;
      }

      if (surfaceDigit !== readingDigit) {
        return false;
      }
    }

    if (wereInputsNumeric) {
      return true;
    }

    // Convert between hiragana and katakana to prevent readings that are equal but in
    // different syllabaries.
    for (let index = 0; index < surface.length; ++index) {
      const surfaceAsHiragana = convertToHiragana(surface[index]);
      const readingAsHiragana = convertToHiragana(reading[index]);
      if (surfaceAsHiragana !== readingAsHiragana) {
        return false;
      }
    }

    return true;
  }

  return false;
}

export default class YahooAPI {
  private readonly requester = new HttpsRequester("jlp.yahooapis.jp");

  public constructor(private readonly appId: string) {}

  public async convertSentenceToFragments(
    sentence: string
  ): Promise<ReadonlyArray<JapaneseTextFragment>> {
    const results = await this.performMorphologicalAnalysis(sentence);
    const { ma_result } = results.ResultSet;
    if (!ma_result) {
      return [];
    }

    const chunks = splitWordListOnReadings(ma_result.word_list.word);
    const fragments: JapaneseTextFragment[] = [];
    let textWithoutYomigana: string[] = [];
    for (const chunk of chunks) {
      if (areSurfaceAndReadingEqual(chunk.surface, chunk.reading)) {
        textWithoutYomigana.push(chunk.surface);
        continue;
      }

      if (textWithoutYomigana.length) {
        fragments.push({
          text: textWithoutYomigana.join(""),
          yomigana: null
        });

        textWithoutYomigana = [];
      }

      fragments.push({
        text: chunk.surface,
        yomigana: chunk.reading
      });
    }

    if (textWithoutYomigana.length) {
      fragments.push({
        text: textWithoutYomigana.join(""),
        yomigana: null
      });
    }

    return fragments;
  }

  private async performMorphologicalAnalysis(
    sentence: string
  ): Promise<MAParseResult> {
    const { body: rawXml } = await this.requester.request({
      method: "POST",
      path:
        "/MAService/V1/parse?" +
        queryString.stringify({
          appid: this.appId,
          results: "ma",
          sentence
        })
    });

    const xml: MAParseResult = xmlParser.parse(rawXml, {
      trimValues: false
    });

    return xml;
  }
}
