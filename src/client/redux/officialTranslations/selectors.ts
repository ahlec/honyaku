import { createSelector } from "reselect";

import { State } from "@client/redux";
import { OfficialTranslation } from "@common/types";

export const getOfficialTranslations: (
  state: State,
  recordId: number
) => ReadonlyArray<OfficialTranslation> = createSelector(
  state => state.officialTranslations,
  (state: State, recordId: number) => recordId,
  (officialTranslations, recordId) => officialTranslations[recordId] || []
);
