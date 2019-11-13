import { Store } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { ApplicationState } from "@client/redux/applicationState";
import { ApplicationStateActions } from "@client/redux/applicationState/actions";
import { OriginRecordsState } from "@client/redux/originRecords";
import { OriginsState } from "@client/redux/origins";
import { RecordsState } from "@client/redux/records";

export interface State {
  applicationState: ApplicationState;
  originRecords: OriginRecordsState;
  origins: OriginsState;
  records: RecordsState;
}

export type ReduxAction = ApplicationStateActions;

export type ReduxStore = Store<State, ReduxAction>;
export type ReduxDispatch = ThunkDispatch<State, void, ReduxAction>;
