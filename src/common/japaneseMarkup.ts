export interface JapaneseTextFragment {
  text: string;
  yomigana: string | null;
}

const FRAGMENT_SEPARATOR = "᎒"; // u1392
const YOMIGANA_SEPARATOR = "↞"; // u219E

export function parseJapaneseMarkup(
  markup: string
): ReadonlyArray<JapaneseTextFragment> {
  const rawFragments = markup.split(FRAGMENT_SEPARATOR);
  const fragments: JapaneseTextFragment[] = [];
  for (const rawFragment of rawFragments) {
    const yomiganaSeparatorIndex = rawFragment.indexOf(YOMIGANA_SEPARATOR);
    if (yomiganaSeparatorIndex < 0) {
      fragments.push({
        text: rawFragment,
        yomigana: null
      });
    } else {
      fragments.push({
        text: rawFragment.substring(0, yomiganaSeparatorIndex),
        yomigana: rawFragment.substring(yomiganaSeparatorIndex + 1)
      });
    }
  }

  return fragments;
}

export function stringifyJapaneseMarkup(
  fragments: ReadonlyArray<JapaneseTextFragment>
): string {
  return fragments
    .map(({ text, yomigana }) =>
      yomigana ? `${text}${YOMIGANA_SEPARATOR}${yomigana}` : text
    )
    .join(FRAGMENT_SEPARATOR);
}
