const concurrently = require("concurrently");

const args = process.argv.slice(2).join(" ");

concurrently([
  {
    command: "yarn start:client",
    prefixColor: "greenBright",
    name: "client"
  },
  {
    command: "yarn start:server " + args,
    prefixColor: "cyanBright",
    name: "server"
  }
]);
