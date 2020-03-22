import Database from "@server/database/Database";
import { FailureType, Response } from "@server/types";
import YahooAPI from "@server/YahooAPI";

import { KanjiMarkupEndpoint } from "@common/endpoints";
import { KanjiMarkupServerResponse } from "@common/serverResponses";
import Logger from "@server/Logger";

export default async function kanjiMarkupEndpoint(
  request: KanjiMarkupEndpoint,
  database: Database,
  yahooApi: YahooAPI
): Promise<Response> {
  if (!request.input) {
    return {
      message: "You must provide a non-empty string to this endpoint",
      success: false,
      type: FailureType.BadInput
    };
  }

  Logger.log("input:", request.input);
  const fragments = await yahooApi.convertSentenceToFragments(request.input);
  Logger.log("fragments:", fragments);

  throw new Error("stop here");

  const response: KanjiMarkupServerResponse = {
    fragments,
    input: request.input
  };

  return {
    payload: response,
    success: true
  };
}
