export type DbBoolean = 0 | 1;

export interface DbOfficialTranslation {
  translation_id: number;
  record_id: number;
  translation: string;
  comments: string | null;
}

export interface DbOrigin {
  origin_id: number;
  title: string;
  origin_type: "game" | "manga" | "anime" | "book" | "news";
}

export interface DbRecord {
  record_id: number;
  created: number;
  has_image: DbBoolean;
  origin_id: number;
  japanese_markup: string | null;
  japanese_kana_only: string | null;
  japanese_kanji_only: string | null;
  origin_chapter_no: number | null;
  origin_page_no: number | null;
  origin_season_no: number | null;
  origin_episode_no: number | null;
}

export interface DbUserTranslation {
  translation_id: number;
  record_id: number;
  created: number;
  modified: number | null;
  translation: string;
  comments: string | null;
}

export enum Schemas {
  OfficialTranslations = "official_translations",
  Origins = "origins",
  Records = "records",
  UserTranslations = "user_translations"
}

export interface SchemaEntryTypes {
  [Schemas.OfficialTranslations]: DbOfficialTranslation;
  [Schemas.Origins]: DbOrigin;
  [Schemas.Records]: DbRecord;
  [Schemas.UserTranslations]: DbUserTranslation;
}

export interface SchemaEntryProtoTypes {
  [Schemas.OfficialTranslations]: Omit<DbOfficialTranslation, "translation_id">;
  [Schemas.Origins]: Omit<DbOrigin, "origin_id">;
  [Schemas.Records]: Omit<DbRecord, "record_id" | "created"> & {
    created: { toSqlString: () => string } | number;
  };
  [Schemas.UserTranslations]: Omit<DbUserTranslation, "translation_id">;
}
