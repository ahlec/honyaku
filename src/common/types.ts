export interface User {
  name: string;
}

export enum OriginType {
  Game = "game",
  Manga = "manga",
  Anime = "anime",
  Book = "book",
  News = "news"
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

export type Source =
  | GameSource
  | MangaSource
  | AnimeSource
  | BookSource
  | NewsSource;

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

export interface Japanese {
  markup: string;
  kanaOnly: string;
  kanjiOnly: string;
}

export interface Record {
  id: number;
  imageUrl: string | null;
  japanese: Japanese | null;
  officialTranslations: ReadonlyArray<OfficialTranslation>;
  source: Source;
  timestampCreated: number;
  userTranslations: ReadonlyArray<UserTranslation>;
}
