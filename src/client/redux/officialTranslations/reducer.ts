import { ReduxAction } from "@client/redux";
import { OfficialTranslationsState } from "./index";

export default function officialTranslationsReducer(
  state: OfficialTranslationsState | undefined = {},
  action: ReduxAction
): OfficialTranslationsState {
  switch (action.type) {
    case "initialized": {
      const next: OfficialTranslationsState = {};
      for (const record of action.records) {
        next[record.id] = [...record.officialTranslations];
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
    case "official-translation-created": {
      const { officialTranslation, recordId } = action;
      return {
        ...state,
        [recordId]: [...(state[recordId] || []), officialTranslation]
      };
    }
    default:
      return state;
  }
}
