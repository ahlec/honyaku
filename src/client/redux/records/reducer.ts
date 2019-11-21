import { ReduxAction } from "@client/redux";
import { RecordsState, ReduxRecord } from "@client/redux/records";
import { ServerRecord } from "@common/types";

function castToReduxRecord(record: ServerRecord): ReduxRecord {
  const { officialTranslations, userTranslations, ...rest } = record;
  return rest;
}

export default function recordsReducer(
  state: RecordsState | undefined = {},
  action: ReduxAction
): RecordsState {
  switch (action.type) {
    case "initialized": {
      const next: RecordsState = {};
      for (const record of action.records) {
        next[record.id] = castToReduxRecord(record);
      }

      return next;
    }
    case "record-created": {
      const { record } = action;
      return {
        ...state,
        [record.id]: castToReduxRecord(record)
      };
    }
    default:
      return state;
  }
}
