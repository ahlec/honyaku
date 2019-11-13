import { ReduxAction } from "@client/redux";
import { OriginRecordsState } from "./index";

export default function originRecordsReducer(
  state: OriginRecordsState | undefined = {},
  action: ReduxAction
): OriginRecordsState {
  switch (action.type) {
    case "initialized": {
      const next: { [originId: number]: number[] } = {};

      for (const record of action.records) {
        let arr = next[record.source.originId];
        if (!arr) {
          arr = [];
          next[record.source.originId] = arr;
        }

        arr.push(record.id);
      }

      return next;
    }
    default:
      return state;
  }
}
