import { Record } from "@common/types";

export interface RecordsState {
  [recordId: number]: Record;
}
