import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/logOnlyInProduction";
import thunk from "redux-thunk";

import { ReduxAction, ReduxStore, State } from "./index";

import applicationStateReducer from "@client/redux/applicationState/reducer";
import originRecordsReducer from "@client/redux/originRecords/reducer";
import originsReducer from "@client/redux/origins/reducer";
import recordsReducer from "@client/redux/records/reducer";

export function createRedux(): ReduxStore {
  return createStore<State, ReduxAction, any, any>(
    combineReducers<State>({
      applicationState: applicationStateReducer,
      originRecords: originRecordsReducer,
      origins: originsReducer,
      records: recordsReducer
    }),
    composeWithDevTools(applyMiddleware(thunk))
  );
}
