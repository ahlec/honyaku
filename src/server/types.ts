import { IncomingMessage } from "http";

import Database from "./database/Database";
import ImgurAPI from "./ImgurAPI";
import YahooAPI from "./YahooAPI";

export { IncomingMessage };

export interface SuccessResponse {
  success: true;
  payload: unknown;
}

export enum FailureType {
  BadInput = "bad-input",
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
    body: unknown,
    database: Database,
    yahooAPI: YahooAPI,
    imgurApi: ImgurAPI
  ) => Promise<Response>;
  requiresAuthentication: boolean;
}
