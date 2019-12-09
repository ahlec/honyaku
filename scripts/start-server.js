const concurrently = require("concurrently");

const args = process.argv.slice(2).join(" ");

concurrently([
  {
    command: "yarn server:build",
    prefixColor: "blueBright",
    name: "typescript"
  },
  {
    command: "yarn server:run " + args,
    prefixColor: "magentaBright",
    name: "main"
  }
]);
