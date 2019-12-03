import Database from "@server/database/Database";
import {
  DbOrigin,
  DbRecord,
  DbUserTranslation,
  Schemas
} from "@server/database/schemas";
import Logger from "@server/Logger";
import { Response } from "@server/types";

import { InitializeServerResponse } from "@common/serverResponses";
import {
  AnimeSource,
  BookSource,
  GameSource,
  MangaSource,
  NewsSource,
  OfficialTranslation,
  Origin,
  OriginType,
  RecordSignificance,
  ServerRecord,
  Source,
  TranslationConfidence,
  UserTranslation,
  WebsiteSource
} from "@common/types";

function getOriginType(dbOrigin: DbOrigin): OriginType {
  switch (dbOrigin.origin_type) {
    case "game":
      return OriginType.Game;
    case "manga":
      return OriginType.Manga;
    case "anime":
      return OriginType.Anime;
    case "book":
      return OriginType.Book;
    case "news":
      return OriginType.News;
    case "website":
      return OriginType.Website;
  }
}

function getSignificance(dbRecord: DbRecord): RecordSignificance {
  switch (dbRecord.significance) {
    case "difficult":
      return RecordSignificance.Difficult;
    case "good-example":
      return RecordSignificance.GoodExample;
    case "interesting":
      return RecordSignificance.Interesting;
  }
}

function getTranslationConfidence(
  dbTranslation: DbUserTranslation
): TranslationConfidence {
  switch (dbTranslation.confidence) {
    case "mostly-guesswork":
      return TranslationConfidence.MostlyGuesswork;
    case "shaky":
      return TranslationConfidence.Shaky;
    case "confident":
      return TranslationConfidence.Confident;
    case "certain":
      return TranslationConfidence.Certain;
  }
}

const SOURCE_CREATORS: {
  [type in OriginType]: (dbRow: DbRecord) => Source | null;
} = {
  [OriginType.Game]: (dbRow: DbRecord): GameSource => ({
    originId: dbRow.origin_id,
    type: OriginType.Game
  }),
  [OriginType.Manga]: (dbRow: DbRecord): MangaSource | null => {
    if (dbRow.origin_chapter_no === null || dbRow.origin_page_no === null) {
      return null;
    }

    return {
      chapterNo: dbRow.origin_chapter_no,
      originId: dbRow.origin_id,
      pageNo: dbRow.origin_page_no,
      type: OriginType.Manga
    };
  },
  [OriginType.Anime]: (dbRow: DbRecord): AnimeSource | null => {
    if (dbRow.origin_episode_no === null || dbRow.origin_season_no === null) {
      return null;
    }

    return {
      episodeNo: dbRow.origin_episode_no,
      originId: dbRow.origin_id,
      seasonNo: dbRow.origin_season_no,
      type: OriginType.Anime
    };
  },
  [OriginType.Book]: (dbRow: DbRecord): BookSource | null => {
    if (dbRow.origin_chapter_no === null || dbRow.origin_page_no === null) {
      return null;
    }

    return {
      chapterNo: dbRow.origin_chapter_no,
      originId: dbRow.origin_id,
      pageNo: dbRow.origin_page_no,
      type: OriginType.Book
    };
  },
  [OriginType.News]: (dbRow: DbRecord): NewsSource => ({
    originId: dbRow.origin_id,
    type: OriginType.News
  }),
  [OriginType.Website]: (dbRow: DbRecord): WebsiteSource | null => {
    if (dbRow.origin_url === null) {
      return null;
    }

    return {
      originId: dbRow.origin_id,
      type: OriginType.Website,
      url: dbRow.origin_url
    };
  }
};

export default async function initializeEndpoint(
  request: never,
  database: Database
): Promise<Response> {
  const [
    dbOrigins,
    dbRecords,
    dbOfficialTranslations,
    dbUserTranslations
  ] = await Promise.all([
    database.all(Schemas.Origins),
    database.all(Schemas.Records),
    database.all(Schemas.OfficialTranslations),
    database.all(Schemas.UserTranslations)
  ]);

  // Handle origins
  const origins: Origin[] = [];
  const originTypeLookup: { [originId: number]: OriginType } = {};
  for (const dbRow of dbOrigins) {
    origins.push({
      id: dbRow.origin_id,
      title: dbRow.title,
      type: getOriginType(dbRow)
    });

    originTypeLookup[dbRow.origin_id] = getOriginType(dbRow);
  }

  // Handle user translations
  const userTranslationsLookup: {
    [recordId: number]: UserTranslation[] | undefined;
  } = {};
  for (const dbRow of dbUserTranslations) {
    let arr = userTranslationsLookup[dbRow.record_id];
    if (!arr) {
      arr = [];
      userTranslationsLookup[dbRow.record_id] = arr;
    }

    // The current version of ts-node is outdated and doesn't seem to be
    // able to infer that dbRow is `DBUserTranslation` and not `DBOfficialTranslation`.
    // Help it out.
    const dbRowCasted: DbUserTranslation = dbRow as DbUserTranslation;

    arr.push({
      comments: dbRow.comments,
      confidence: getTranslationConfidence(dbRowCasted),
      id: dbRow.translation_id,
      text: dbRow.translation,
      timestampCreated: dbRowCasted.created.valueOf(),
      timestampModified: dbRowCasted.modified
        ? dbRowCasted.modified.valueOf()
        : null
    });
  }

  // Handle official translations
  const officialTranslationsLookup: {
    [recordId: number]: OfficialTranslation[] | undefined;
  } = {};
  for (const dbRow of dbOfficialTranslations) {
    let arr = officialTranslationsLookup[dbRow.record_id];
    if (!arr) {
      arr = [];
      officialTranslationsLookup[dbRow.record_id] = arr;
    }

    arr.push({
      comments: dbRow.comments,
      id: dbRow.translation_id,
      text: dbRow.translation
    });
  }

  // Handle records
  const records: ServerRecord[] = [];
  for (const dbRow of dbRecords) {
    const originId = dbRow.origin_id;
    const originType = originTypeLookup[originId];
    const source = SOURCE_CREATORS[originType](dbRow);
    if (!source) {
      Logger.warn("BAD DATA:", dbRow.record_id);
      continue;
    }

    records.push({
      id: dbRow.record_id,
      imageUrl: dbRow.imgur_link,
      japaneseMarkup: dbRow.japanese_markup,
      officialTranslations: officialTranslationsLookup[dbRow.record_id] || [],
      significance: getSignificance(dbRow),
      source,
      timestampCreated: dbRow.created.valueOf(),
      userTranslations: userTranslationsLookup[dbRow.record_id] || []
    });
  }

  const response: InitializeServerResponse = {
    origins,
    records
  };

  return {
    payload: response,
    success: true
  };
}
