import { ReduxAction } from "@client/redux";
import { RecordsState } from "@client/redux/records";

export default function recordsReducer(
  state: RecordsState | undefined = {},
  action: ReduxAction
): RecordsState {
  switch (action.type) {
    case "initialized": {
      const next: RecordsState = {};
      for (const record of action.records) {
        next[record.id] = record;
      }

      return next;
    }
    case "record-created": {
      const { record } = action;
      return {
        ...state,
        [record.id]: record
      };
    }
    default:
      return state;
  }
}
