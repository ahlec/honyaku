import { ReduxAction } from "@client/redux";
import { UserTranslationsState } from "./index";

export default function userTranslationsReducer(
  state: UserTranslationsState | undefined = {},
  action: ReduxAction
): UserTranslationsState {
  switch (action.type) {
    case "initialized": {
      const next: UserTranslationsState = {};
      for (const record of action.records) {
        next[record.id] = [...record.userTranslations];
      }

      return next;
    }
    case "record-created": {
      const { record } = action;
      return {
        ...state,
        [record.id]: []
      };
    }
    case "user-translation-created": {
      const { recordId, userTranslation } = action;
      return {
        ...state,
        [recordId]: [...(state[recordId] || []), userTranslation]
      };
    }
    default:
      return state;
  }
}
