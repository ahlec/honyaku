import { values } from "lodash";
import { createSelector } from "reselect";

import { State } from "@client/redux";
import { Origin } from "@common/types";

import { OriginTypeLookup } from "./index";

export const getOriginsArray: (
  state: State
) => ReadonlyArray<Origin> = createSelector(
  state => state.origins,
  origins => values(origins)
);

export const getOriginTypeLookup: (
  state: State
) => OriginTypeLookup = createSelector(
  getOriginsArray,
  (origins): OriginTypeLookup => {
    const lookup: OriginTypeLookup = {};

    for (const origin of origins) {
      lookup[origin.id] = origin.type;
    }

    return lookup;
  }
);
