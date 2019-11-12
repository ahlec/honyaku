import { ReduxAction } from "@client/redux";
import { ApplicationState } from "@client/redux/applicationState";

export default function applicationStateReducer(
  state: ApplicationState | undefined = ApplicationState.Initializing,
  action: ReduxAction
): ApplicationState {
  switch (action.type) {
    case "initialized": {
      // TODO [MVP]: Ignoring authentication
      return ApplicationState.Authenticated;
    }
    case "fatal-error": {
      return ApplicationState.Crashed;
    }
    default:
      return state;
  }
}
