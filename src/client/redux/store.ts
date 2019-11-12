import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/logOnlyInProduction";
import thunk from "redux-thunk";

import { ReduxAction, ReduxStore, State } from "./index";

import applicationStateReducer from "@client/redux/applicationState/reducer";
import originsReducer from "@client/redux/origins/reducer";

export function createRedux(): ReduxStore {
  return createStore<State, ReduxAction, any, any>(
    combineReducers<State>({
      applicationState: applicationStateReducer,
      origins: originsReducer
    }),
    composeWithDevTools(applyMiddleware(thunk))
  );
}
