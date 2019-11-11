import { IncomingMessage } from "http";

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

export type Endpoint = (request: IncomingMessage) => Promise<Response>;
