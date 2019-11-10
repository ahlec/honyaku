import {
  combineReducers,
  createStore,
  Dispatch as ReduxDispatch,
  Store as ReduxStore
} from "redux";
import { composeWithDevTools } from "redux-devtools-extension/logOnlyInProduction";
import { State } from "./index";

import authenticatedReducer from "./reducers/authenticated";

type Action = any;

export type Store = ReduxStore<State, Action>;
export type Dispatch = ReduxDispatch<Action>;

export function createRedux(): Store {
  return createStore<State, Action, any, any>(
    combineReducers<State>({
      authenticated: authenticatedReducer
    }),
    composeWithDevTools()
  );
}
