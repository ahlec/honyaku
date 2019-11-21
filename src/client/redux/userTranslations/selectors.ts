import { createSelector } from "reselect";

import { State } from "@client/redux";
import { UserTranslation } from "@common/types";

export const getUserTranslations: (
  state: State,
  recordId: number
) => ReadonlyArray<UserTranslation> = createSelector(
  state => state.userTranslations,
  (state: State, recordId: number) => recordId,
  (userTranslations, recordId) => userTranslations[recordId] || []
);
