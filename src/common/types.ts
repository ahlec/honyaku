export interface User {
  name: string;
}

export interface JapaneseFragment {
  kana: string;
  kanji: string | null;
}

export type Japanese = ReadonlyArray<JapaneseFragment>;

export enum SourceType {
  Game = "game",
  Manga = "manga",
  Anime = "anime",
  Book = "book",
  News = "news"
}

export interface Origin {
  id: string;
  title: string;
}

export interface GameSource {
  originId: string;
  type: SourceType.Game;
}

export interface MangaSource {
  chapterNo: number;
  originId: string;
  pageNo: number;
  type: SourceType.Manga;
}

export interface AnimeSource {
  episodeNo: number;
  originId: string;
  type: SourceType.Anime;
  seasonNo: number;
}

export interface BookSource {
  chapterNo: number;
  originId: string;
  pageNo: number;
  type: SourceType.Book;
}

export interface NewsSource {
  type: SourceType.News;
}

export type Source =
  | GameSource
  | MangaSource
  | AnimeSource
  | BookSource
  | NewsSource;

export interface UserTranslation {
  comments: string | null;
  timestampCreated: number;
  timestampModified: number | null;
  translation: string;
}

export interface OfficialTranslation {
  comments: string | null;
  translation: string;
}

export interface Record {
  id: string;
  imageUrl: string | null;
  japanese: Japanese | null;
  officialTranslations: ReadonlyArray<OfficialTranslation>;
  source: Source;
  timestampCreated: number;
  userTranslations: ReadonlyArray<UserTranslation>;
}
