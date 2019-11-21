import { Store } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { ApplicationState } from "@client/redux/applicationState";
import { ApplicationStateActions } from "@client/redux/applicationState/actions";
import { OfficialTranslationsState } from "@client/redux/officialTranslations";
import { OfficialTranslationActions } from "@client/redux/officialTranslations/actions";
import { OriginRecordsState } from "@client/redux/originRecords";
import { OriginsState } from "@client/redux/origins";
import { RecordsState } from "@client/redux/records";
import { RecordActions } from "@client/redux/records/actions";
import { UserTranslationsState } from "@client/redux/userTranslations";
import { UserTranslationActions } from "@client/redux/userTranslations/actions";

export interface State {
  applicationState: ApplicationState;
  officialTranslations: OfficialTranslationsState;
  originRecords: OriginRecordsState;
  origins: OriginsState;
  records: RecordsState;
  userTranslations: UserTranslationsState;
}

export type ReduxAction =
  | ApplicationStateActions
  | OfficialTranslationActions
  | RecordActions
  | UserTranslationActions;

export type ReduxStore = Store<State, ReduxAction>;
export type ReduxDispatch = ThunkDispatch<State, void, ReduxAction>;
