import dotenv from "dotenv";
import { existsSync, readFileSync } from "fs";
import { size, values } from "lodash";
import { resolve as resolvePath } from "path";

import { CliArguments } from "./cli";
import { ConnectionInfo } from "./database/Database";

export interface ServerEnvironment {
  dbConnectionInfo: ConnectionInfo;
  yahooApiKey: string;
  corsHeaders: Readonly<{ [header: string]: string }>;
  useHttps: boolean;
}

/**
 * Values should be the actual key name for the .env file
 */
enum EnvKeys {
  DevDbHost = "DEV_DB_HOST",
  DevDbUser = "DEV_DB_USER",
  DevDbPassword = "DEV_DB_PASSWORD",
  DevDbSchema = "DEV_DB_SCHEMA",
  DevDbPort = "DEV_DB_PORT",

  ProdDbHost = "PROD_DB_HOST",
  ProdDbUser = "PROD_DB_USER",
  ProdDbPassword = "PROD_DB_PASSWORD",
  ProdDbSchema = "PROD_DB_SCHEMA",
  ProdDbPort = "PROD_DB_PORT",

  YahooApiClientId = "YAHOO_API_CLIENT_ID"
}

function getEnvConfig(): { [key in EnvKeys]: string } {
  const file = resolvePath(process.cwd(), ".env");
  if (!existsSync(file)) {
    throw new Error(`Could not find the file "${file}"`);
  }

  const envConfig = dotenv.parse(readFileSync(file));
  const missingEnvKeys = values(EnvKeys).filter(key => !envConfig[key]);
  if (missingEnvKeys.length) {
    throw new Error(
      `Missing the following .env key(s): ${missingEnvKeys.join(", ")}`
    );
  }

  if (size(envConfig) !== size(EnvKeys)) {
    throw new Error(
      "There are additional, unrecognized keys in your .env file."
    );
  }

  // We've ensured that all of our keys are present and there are no additional keys. Safe to cast.
  // When TypeScript asserts arrive, this is a perfect location for it.
  return envConfig as { [key in EnvKeys]: string };
}

export function getServerEnvironment(args: CliArguments): ServerEnvironment {
  const envConfig = getEnvConfig();

  let dbHost: string;
  let dbUser: string;
  let dbPassword: string;
  let dbSchema: string;
  let dbPortStr: string;
  if (args.prod) {
    dbHost = envConfig[EnvKeys.ProdDbHost];
    dbUser = envConfig[EnvKeys.ProdDbUser];
    dbPassword = envConfig[EnvKeys.ProdDbPassword];
    dbSchema = envConfig[EnvKeys.ProdDbSchema];
    dbPortStr = envConfig[EnvKeys.ProdDbPort];
  } else {
    dbHost = envConfig[EnvKeys.DevDbHost];
    dbUser = envConfig[EnvKeys.DevDbUser];
    dbPassword = envConfig[EnvKeys.DevDbPassword];
    dbSchema = envConfig[EnvKeys.DevDbSchema];
    dbPortStr = envConfig[EnvKeys.DevDbPort];
  }

  const dbPort = parseInt(dbPortStr, 10);
  if (!isFinite(dbPort)) {
    throw new Error(
      `Non-finite integer value provided for db port: ${dbPortStr}`
    );
  }

  const { NODE_ENV = "development" } = process.env;

  return {
    corsHeaders:
      NODE_ENV === "production"
        ? {}
        : {
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "http://localhost:7000"
          },
    dbConnectionInfo: {
      host: dbHost,
      password: dbPassword,
      port: dbPort,
      schema: dbSchema,
      user: dbUser
    },
    useHttps: NODE_ENV !== "development",
    yahooApiKey: envConfig[EnvKeys.YahooApiClientId]
  };
}
