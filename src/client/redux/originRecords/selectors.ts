import { createSelector } from "reselect";

import { Record } from "@common/types";

import { State } from "@client/redux";

export const getRecordsFromOrigin: (
  state: State,
  originId: number
) => ReadonlyArray<Record> = createSelector(
  (state: State, originId: number) => state.originRecords[originId],
  (state: State) => state.records,
  (originRecords, recordsLookup): ReadonlyArray<Record> => {
    if (!originRecords || !originRecords.length) {
      return [];
    }

    const records: Record[] = [];
    for (const recordId of originRecords) {
      records.push(recordsLookup[recordId]);
    }

    return records;
  }
);
