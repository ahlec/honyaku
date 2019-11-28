import { UserTranslation } from "@common/types";

import { ReduxAction } from "@client/redux";
import { UserTranslationsState } from "./index";

function updateTranslation(
  state: UserTranslationsState,
  recordId: number,
  translationId: number,
  changes: Partial<UserTranslation>
): UserTranslationsState {
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
    case "user-translation-text-changed": {
      const { recordId, text, timestampModified, translationId } = action;
      return updateTranslation(state, recordId, translationId, {
        timestampModified,
        text
      });
    }
    default:
      return state;
  }
}
