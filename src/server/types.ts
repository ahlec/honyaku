import { IncomingMessage } from "http";

import Database from "./database/Database";

export { IncomingMessage };

export interface SuccessResponse {
  success: true;
  payload: unknown;
}

export enum FailureType {
  Error = "error",
  NotAuthenticated = "not-authenticated"
}

export interface FailureResponse {
  success: false;
  type: FailureType;
  message: string;
}

export type Response = SuccessResponse | FailureResponse;

export interface Endpoint {
  processor: (
    request: IncomingMessage,
    database: Database
  ) => Promise<Response>;
  requiresAuthentication: boolean;
}
