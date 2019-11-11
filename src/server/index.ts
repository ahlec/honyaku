import * as http from "http";
import * as https from "https";

import { ENDPOINTS } from "./endpointRegistry";
import { CURRENT_ENVIRONMENT, Environment } from "./environment";
import { FailureType } from "./types";

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

    const result = await endpoint(request);
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
  console.log("received...");
  const { body, statusCode } = await handleRequest(request);

  if (CURRENT_ENVIRONMENT === Environment.Development) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    //    headers["Access-Control-Allow-Origin"] = request.headers.origin;
  }

  response.writeHead(statusCode);
  response.write(body);
  response.end();
}

const createServer =
  CURRENT_ENVIRONMENT === Environment.Production
    ? https.createServer
    : http.createServer;
createServer(serverDispatcher).listen(8081);
console.log("listening...", process.env.NODE_ENV);
