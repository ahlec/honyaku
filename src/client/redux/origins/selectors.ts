import { values } from "lodash";
import { createSelector } from "reselect";

import { State } from "@client/redux";
import { Origin } from "@common/types";

export const getOriginsArray: (
  state: State
) => ReadonlyArray<Origin> = createSelector(
  state => state.origins,
  origins => values(origins)
);
