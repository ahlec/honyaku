export interface User {
  name: string;
}

export enum OriginType {
  Game = "game",
  Manga = "manga",
  Anime = "anime",
  Book = "book",
  News = "news",
  Website = "website"
}

export interface Origin {
  id: number;
  title: string;
  type: OriginType;
}

export interface GameSource {
  originId: number;
  type: OriginType.Game;
}

export interface MangaSource {
  chapterNo: number;
  originId: number;
  pageNo: number;
  type: OriginType.Manga;
}

export interface AnimeSource {
  episodeNo: number;
  originId: number;
  seasonNo: number;
  type: OriginType.Anime;
}

export interface BookSource {
  chapterNo: number;
  originId: number;
  pageNo: number;
  type: OriginType.Book;
}

export interface NewsSource {
  originId: number;
  type: OriginType.News;
}

export interface WebsiteSource {
  originId: number;
  type: OriginType.Website;
  url: string;
}

export type Source =
  | GameSource
  | MangaSource
  | AnimeSource
  | BookSource
  | NewsSource
  | WebsiteSource;

export interface UserTranslation {
  comments: string | null;
  id: number;
  timestampCreated: number;
  timestampModified: number | null;
  translation: string;
}

export interface OfficialTranslation {
  comments: string | null;
  id: number;
  translation: string;
}

export enum RecordSignificance {
  Difficult = "difficult",
  GoodExample = "good-example",
  Interesting = "interesting"
}

export interface Record {
  id: number;
  significance: RecordSignificance;
  imageUrl: string | null;
  japaneseMarkup: string;
  officialTranslations: ReadonlyArray<OfficialTranslation>;
  source: Source;
  timestampCreated: number;
  userTranslations: ReadonlyArray<UserTranslation>;
}

export type ProtoRecord = Omit<
  Record,
  | "id"
  | "imageUrl"
  | "officialTranslations"
  | "timestampCreated"
  | "userTranslations"
>;
