import { values } from "lodash";
import { createSelector } from "reselect";

import { State } from "@client/redux";
import { Origin, OriginType } from "@common/types";

import { OriginsLookup, OriginTypeLookup } from "./index";

export const getOriginsArray: (
  state: State
) => ReadonlyArray<Origin> = createSelector(
  state => state.origins,
  origins => values(origins)
);

export const getOriginsLookup: (state: State) => OriginsLookup = createSelector(
  getOriginsArray,
  (origins): OriginsLookup => {
    const lookup: { [type in OriginType]: Origin[] } = values(
      OriginType
    ).reduce((l: any, type) => {
      l[type] = [];
      return l;
    }, {});

    for (const origin of origins) {
      lookup[origin.type].push(origin);
    }

    return lookup;
  }
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
