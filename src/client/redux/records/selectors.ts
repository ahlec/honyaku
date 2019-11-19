import { values } from "lodash";
import { createSelector } from "reselect";

import { State } from "@client/redux";
import { Record } from "@common/types";

export const getRecordsArray: (
  state: State
) => ReadonlyArray<Record> = createSelector(
  state => state.records,
  records => values(records)
);
