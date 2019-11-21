import { UserTranslation } from "@common/types";

export interface UserTranslationsState {
  [recordId: number]: ReadonlyArray<UserTranslation> | undefined;
}
