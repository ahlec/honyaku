import { orderBy } from "lodash";
import { createSelector } from "reselect";

import { State } from "@client/redux";
import { UserTranslation } from "@common/types";

export enum ChronologicalOrder {
  OldestFirst = "oldest-first",
  NewestFirst = "newest-first"
}

export const getUserTranslations: (
  state: State,
  recordId: number
) => ReadonlyArray<UserTranslation> = createSelector(
  state => state.userTranslations,
  (state: State, recordId: number) => recordId,
  (userTranslations, recordId) => userTranslations[recordId] || []
);

function selectTimestampCreated(userTranslation: UserTranslation): number {
  return userTranslation.timestampCreated;
}

export const getChronologicalUserTranslations: (
  state: State,
  recordId: number,
  order: ChronologicalOrder
) => ReadonlyArray<UserTranslation> = createSelector(
  getUserTranslations,
  (state: State, recordId: number, order: ChronologicalOrder) => order,
  (userTranslations, order): ReadonlyArray<UserTranslation> => {
    return orderBy(userTranslations, selectTimestampCreated, [
      order === ChronologicalOrder.OldestFirst ? "asc" : "desc"
    ]);
  }
);
