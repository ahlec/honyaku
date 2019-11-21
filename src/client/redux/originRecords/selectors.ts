import { createSelector } from "reselect";

import { State } from "@client/redux";
import { ReduxRecord } from "@client/redux/records";

export const getRecordsFromOrigin: (
  state: State,
  originId: number
) => ReadonlyArray<ReduxRecord> = createSelector(
  (state: State, originId: number) => state.originRecords[originId],
  (state: State) => state.records,
  (originRecords, recordsLookup): ReadonlyArray<ReduxRecord> => {
    if (!originRecords || !originRecords.length) {
      return [];
    }

    const records: ReduxRecord[] = [];
    for (const recordId of originRecords) {
      records.push(recordsLookup[recordId]);
    }

    return records;
  }
);
