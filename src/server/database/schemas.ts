export type DbBoolean = 0 | 1;
export type DbTimestamp = Date;

export interface DbOfficialTranslation {
  translation_id: number;
  record_id: number;
  translation: string;
  comments: string | null;
}

export interface DbOrigin {
  origin_id: number;
  title: string;
  origin_type: "game" | "manga" | "anime" | "book" | "news" | "website";
}

export interface DbRecord {
  record_id: number;
  created: DbTimestamp;
  significance: "difficult" | "good-example" | "interesting";
  has_image: DbBoolean;
  origin_id: number;
  japanese_markup: string;
  origin_chapter_no: number | null;
  origin_page_no: number | null;
  origin_season_no: number | null;
  origin_episode_no: number | null;
  origin_url: string | null;
}

export interface DbUserTranslation {
  translation_id: number;
  record_id: number;
  created: DbTimestamp;
  modified: DbTimestamp | null;
  translation: string;
  comments: string | null;
  confidence: "mostly-guesswork" | "shaky" | "confident" | "certain";
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

export const SCHEMA_PRIMARY_KEY: { [schema in Schemas]: string } = {
  [Schemas.OfficialTranslations]: "translation_id",
  [Schemas.Origins]: "origin_id",
  [Schemas.Records]: "record_id",
  [Schemas.UserTranslations]: "translation_id"
};

export interface SchemaEntryProtoTypes {
  [Schemas.OfficialTranslations]: Omit<DbOfficialTranslation, "translation_id">;
  [Schemas.Origins]: Omit<DbOrigin, "origin_id">;
  [Schemas.Records]: Omit<DbRecord, "record_id">;
  [Schemas.UserTranslations]: Omit<DbUserTranslation, "translation_id">;
}
