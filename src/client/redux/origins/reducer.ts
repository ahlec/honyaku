import { ReduxAction } from "@client/redux";
import { OriginsState } from "@client/redux/origins";

export default function originsReducer(
  state: OriginsState | undefined = {},
  action: ReduxAction
): OriginsState {
  switch (action.type) {
    case "initialized": {
      const next: OriginsState = {};
      for (const origin of action.origins) {
        next[origin.id] = origin;
      }

      return next;
    }
    default:
      return state;
  }
}
