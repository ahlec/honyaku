import { Record } from "@common/types";

export type ProtoRecord = Omit<
  Record,
  | "id"
  | "imageUrl"
  | "officialTranslations"
  | "timestampCreated"
  | "userTranslations"
>;
