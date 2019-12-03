import yargs, { Arguments } from "yargs";

interface CliArgumentsDefinition {
  port: number;
  prod: boolean;
}

export type CliArguments = {
  [key in keyof Arguments<CliArgumentsDefinition>]: Arguments<
    CliArgumentsDefinition
  >[key];
};

export function processCli(): CliArguments {
  return yargs.options({
    port: { type: "number", default: 7001 },
    prod: { type: "boolean", default: false }
  }).argv;
}
