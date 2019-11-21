import { OfficialTranslation } from "@common/types";

export interface OfficialTranslationsState {
  [recordId: number]: ReadonlyArray<OfficialTranslation> | undefined;
}
