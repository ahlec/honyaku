import { fetchApi } from "@client/api";
import { ReduxDispatch } from "@client/redux";

import { InitializeServerResponse } from "@common/serverResponses";
import { Origin, Record } from "@common/types";

export interface ActionInitialized {
  type: "initialized";

  origins: ReadonlyArray<Origin>;
  records: ReadonlyArray<Record>;
}

export interface ActionFatalError {
  message: string;
  type: "fatal-error";
}

export type ApplicationStateActions = ActionInitialized | ActionFatalError;

export function initialize() {
  return async (dispatch: ReduxDispatch) => {
    try {
      const response = await fetchApi<InitializeServerResponse>({
        endpoint: "/initialize",
        method: "GET"
      });

      const action: ActionInitialized = {
        type: "initialized",
        ...response
      };

      dispatch(action);
    } catch (err) {
      const errorAction: ActionFatalError = {
        message: "Encountered an error during initialization",
        type: "fatal-error"
      };
      dispatch(errorAction);
    }
  };
}
