import { values } from "lodash";
import { createSelector } from "reselect";

import { State } from "@client/redux";
import { ReduxRecord } from "./index";

export const getRecordsArray: (
  state: State
) => ReadonlyArray<ReduxRecord> = createSelector(
  state => state.records,
  records => values(records)
);
