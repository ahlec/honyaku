import chalk from "chalk";
import * as http from "http";
import * as https from "https";
import { padStart, toPairs } from "lodash";

import { ServerEnvironment } from "./environment";
import Logger from "./Logger";
import { Endpoint, FailureType, Response } from "./types";

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

export default class Webserver {
  private server: http.Server | https.Server | null = null;
  private readonly corsHeaders: ReadonlyArray<[string, string]>;
  private readonly useHttps: boolean;
  private readonly port: number;

  public constructor(
    serverEnvironment: ServerEnvironment,
    private readonly endpoints: { [endpoint: string]: Endpoint | undefined },
    private readonly endpointProcessor: (
      endpoint: Endpoint,
      body: unknown
    ) => Promise<Response>
  ) {
    this.corsHeaders = toPairs(serverEnvironment.corsHeaders);
    this.useHttps = serverEnvironment.webserver.useHttps;
    this.port = serverEnvironment.webserver.port;
  }

  public start() {
    if (this.server) {
      throw new Error("This webserver is already running.");
    }

    const createServer = this.useHttps ? https.createServer : http.createServer;
    this.log(
      "Creating an",
      chalk.magentaBright(this.useHttps ? "HTTPS" : "HTTP"),
      `server listening to port ${chalk.yellowBright(this.port)}.`
    );

    this.server = createServer(this.serverDispatcher);
    this.server.listen(
      {
        port: this.port
      },
      this.onServerListening
    );
  }

  public stop() {
    if (!this.server) {
      throw new Error("This webserver is not running.");
    }

    this.log("Stopping server.");
    this.server.close();
    this.server = null;
  }

  private onServerListening = () => {
    this.log("Now listening.");
  };

  private async handleRequest(
    request: http.IncomingMessage
  ): Promise<{ statusCode: number; body: string }> {
    try {
      const endpoint = request.url && this.endpoints[request.url];
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
      const result = await this.endpointProcessor(endpoint, body);
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

  private serverDispatcher = async (
    request: http.IncomingMessage,
    response: http.ServerResponse
  ) => {
    this.log(padStart(request.method, 7), request.url);
    const { body, statusCode } = await this.handleRequest(request);

    for (const [header, value] of this.corsHeaders) {
      response.setHeader(header, value);
    }

    response.setHeader("Content-Type", "application/json; charset=utf-8");

    response.writeHead(statusCode);
    response.write(body);
    response.end();
  };

  private log(...args: ReadonlyArray<any>) {
    Logger.log(chalk.greenBright("[Webserver]"), ...args);
  }
}
