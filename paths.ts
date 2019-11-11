import { resolve } from "path";

export const ROOT_DIRECTORY = __dirname;
export const DATABASE_DIRECTORY = resolve(ROOT_DIRECTORY, "./database");
export const SOURCE_DIRECTORY = resolve(ROOT_DIRECTORY, "./src");
export const COMMON_DIRECTORY = resolve(SOURCE_DIRECTORY, "./common");
export const CLIENT_DIRECTORY = resolve(SOURCE_DIRECTORY, "./client");
export const SERVER_DIRECTORY = resolve(SOURCE_DIRECTORY, "./server");
export const BUILD_DIRECTORY = resolve(ROOT_DIRECTORY, "./build");
