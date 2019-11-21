import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/logOnlyInProduction";
import thunk from "redux-thunk";

import { ReduxAction, ReduxStore, State } from "./index";

import applicationStateReducer from "@client/redux/applicationState/reducer";
import officialTranslationsReducer from "@client/redux/officialTranslations/reducer";
import originRecordsReducer from "@client/redux/originRecords/reducer";
import originsReducer from "@client/redux/origins/reducer";
import recordsReducer from "@client/redux/records/reducer";
import userTranslationsReducer from "@client/redux/userTranslations/reducer";

export function createRedux(): ReduxStore {
  return createStore<State, ReduxAction, any, any>(
    combineReducers<State>({
      applicationState: applicationStateReducer,
      officialTranslations: officialTranslationsReducer,
      originRecords: originRecordsReducer,
      origins: originsReducer,
      records: recordsReducer,
      userTranslations: userTranslationsReducer
    }),
    composeWithDevTools(applyMiddleware(thunk))
  );
}
