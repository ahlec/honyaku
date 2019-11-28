import { OfficialTranslation } from "@common/types";

import { ReduxAction } from "@client/redux";
import { OfficialTranslationsState } from "./index";

function updateTranslation(
  state: OfficialTranslationsState,
  recordId: number,
  translationId: number,
  changes: Partial<OfficialTranslation>
): OfficialTranslationsState {
  const nextRecord = [...(state[recordId] || [])];
  const index = nextRecord.findIndex(
    translation => translation.id === translationId
  );
  if (index < 0) {
    return state;
  }

  nextRecord[index] = { ...nextRecord[index], ...changes };
  return {
    ...state,
    [recordId]: nextRecord
  };
}

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
    case "official-translation-text-changed": {
      const { recordId, text, translationId } = action;
      return updateTranslation(state, recordId, translationId, {
        translation: text
      });
    }
    default:
      return state;
  }
}
