import chalk from "chalk";

import { processCli } from "./cli";
import Database from "./database/Database";
import { ENDPOINTS } from "./endpointRegistry";
import { getServerEnvironment } from "./environment";
import Logger from "./Logger";
import Webserver from "./webserver";
import YahooAPI from "./YahooAPI";

async function main() {
  Logger.log(chalk.blueBright("[Honyaku Server]"));
  const args = processCli();
  const serverEnvironment = getServerEnvironment(args);

  const database = Database.open(serverEnvironment.dbConnectionInfo);
  const yahooApi = new YahooAPI(serverEnvironment.yahooApiKey);
  const webserver = new Webserver(
    serverEnvironment,
    ENDPOINTS,
    (endpoint, body) => endpoint.processor(body, database, yahooApi)
  );

  webserver.start();
}

main();
