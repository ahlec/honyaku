import { Store } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { ApplicationState } from "@client/redux/applicationState";
import { ApplicationStateActions } from "@client/redux/applicationState/actions";
import { OriginsState } from "@client/redux/origins";

export interface State {
  applicationState: ApplicationState;
  origins: OriginsState;
}

export type ReduxAction = ApplicationStateActions;

export type ReduxStore = Store<State, ReduxAction>;
export type ReduxDispatch = ThunkDispatch<State, void, ReduxAction>;
