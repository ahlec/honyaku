import { Origin, Record } from "./types";

export interface InitializeServerResponse {
  origins: ReadonlyArray<Origin>;
  records: ReadonlyArray<Record>;
}

export interface CreateRecordServerResponse {
  recordId: number;
}
