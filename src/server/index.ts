import dotenv from "dotenv";
dotenv.config();

import * as http from "http";
import * as https from "https";

import Database from "./database/Database";
import { ENDPOINTS } from "./endpointRegistry";
import { CURRENT_ENVIRONMENT, Environment } from "./environment";
import Logger from "./Logger";
import { FailureType } from "./types";

function main() {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_SCHEMA } = process.env;
  if (!DB_HOST || !DB_PORT || !DB_USER || !DB_PASSWORD || !DB_SCHEMA) {
    Logger.error("Missing one or more of the required .env fields");
    process.exit(2);
    return;
  }

  const database = Database.open({
    host: DB_HOST,
    password: DB_PASSWORD,
    port: parseInt(DB_PORT, 10),
    schema: DB_SCHEMA,
    user: DB_USER
  });

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

      const result = await endpoint.processor(request, database);
      if (!result.success) {
        let statusCode: number;
        switch (result.type) {
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

    if (CURRENT_ENVIRONMENT === Environment.Development) {
      response.setHeader("Access-Control-Allow-Origin", "*");
    }

    response.setHeader("Content-Type", "application/json; charset=utf-8");

    response.writeHead(statusCode);
    response.write(body);
    response.end();
  }

  const createServer =
    CURRENT_ENVIRONMENT === Environment.Production
      ? https.createServer
      : http.createServer;
  createServer(serverDispatcher).listen(8081);
  Logger.log("listening...", process.env.NODE_ENV);
}

main();
