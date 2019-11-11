import { ActionInitialized } from "@client/redux/actions";

type ReducerAction = ActionInitialized;

export default function authenticatedReducer(
  state: boolean | undefined = false,
  action: ReducerAction
): boolean {
  switch (action.type) {
    case "initialized": {
      return true;
    }
    default:
      return state;
  }
}
