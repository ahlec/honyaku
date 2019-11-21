import { ServerRecord } from "@common/types";

export type ReduxRecord = Omit<
  ServerRecord,
  "officialTranslations" | "userTranslations"
>;

export interface RecordsState {
  [recordId: number]: ReduxRecord;
}
