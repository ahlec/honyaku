import * as http from "http";
import * as https from "https";
import { toPairs } from "lodash";

import { processCli } from "./cli";
import Database from "./database/Database";
import { ENDPOINTS } from "./endpointRegistry";
import { getServerEnvironment } from "./environment";
import Logger from "./Logger";
import { FailureType } from "./types";
import YahooAPI from "./YahooAPI";

async function readJsonBody(request: http.IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const body: string[] = [];
    request.on("data", chunk => body.push(chunk));
    request.on("end", () => {
      const bodyStr = body.join("");
      try {
        if (!bodyStr) {
          resolve({});
          return;
        }

        const parsed = JSON.parse(bodyStr);
        resolve(parsed);
      } catch (e) {
        reject(e);
      }
    });
  });
}

async function main() {
  const args = processCli();
  const serverEnvironment = getServerEnvironment(args);
  const corsHeaders = toPairs(serverEnvironment.corsHeaders);

  const database = Database.open(serverEnvironment.dbConnectionInfo);
  const yahooApi = new YahooAPI(serverEnvironment.yahooApiKey);

  async function handleRequest(
    request: http.IncomingMessage
  ): Promise<{ statusCode: number; body: string }> {
    try {
      const endpoint = request.url && ENDPOINTS[request.url];
      if (!endpoint) {
        return {
          body: "Resource not found",
          statusCode: 404
        };
      }

      if (request.method === "OPTIONS") {
        return {
          body: "",
          statusCode: 200
        };
      }

      const body = await readJsonBody(request);
      const result = await endpoint.processor(body, database, yahooApi);
      if (!result.success) {
        let statusCode: number;
        switch (result.type) {
          case FailureType.BadInput: {
            statusCode = 400;
            break;
          }
          case FailureType.Error: {
            statusCode = 500;
            break;
          }
          case FailureType.NotAuthenticated: {
            statusCode = 403;
            break;
          }
          default: {
            statusCode = 400;
          }
        }

        return {
          body: result.message,
          statusCode
        };
      }

      return {
        body: JSON.stringify(result.payload),
        statusCode: 200
      };
    } catch (e) {
      Logger.error(e);

      return {
        body: "The server has encountered an error",
        statusCode: 500
      };
    }
  }

  async function serverDispatcher(
    request: http.IncomingMessage,
    response: http.ServerResponse
  ) {
    Logger.log("received...");
    const { body, statusCode } = await handleRequest(request);

    for (const [header, value] of corsHeaders) {
      response.setHeader(header, value);
    }

    response.setHeader("Content-Type", "application/json; charset=utf-8");

    response.writeHead(statusCode);
    response.write(body);
    response.end();
  }

  const createServer = serverEnvironment.useHttps
    ? https.createServer
    : http.createServer;
  createServer(serverDispatcher).listen(8081);
  Logger.log("listening...", process.env.NODE_ENV);
}

main();
