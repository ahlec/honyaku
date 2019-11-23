import { OriginType, RecordSignificance } from "@common/types";

export const ORIGIN_TYPE_DEFINITIONS: {
  [originType in OriginType]: { displayName: string };
} = {
  [OriginType.Game]: {
    displayName: "Video Game"
  },
  [OriginType.Manga]: {
    displayName: "Manga"
  },
  [OriginType.Anime]: {
    displayName: "Anime"
  },
  [OriginType.Book]: {
    displayName: "Book"
  },
  [OriginType.News]: {
    displayName: "News"
  },
  [OriginType.Website]: {
    displayName: "Website"
  }
};

export const RECORD_SIGNIFICANCE_DEFINITIONS: {
  [significance in RecordSignificance]: { displayName: string };
} = {
  [RecordSignificance.Difficult]: {
    displayName: "Difficult"
  },
  [RecordSignificance.GoodExample]: {
    displayName: "Good Example"
  },
  [RecordSignificance.Interesting]: {
    displayName: "Interesting"
  }
};
