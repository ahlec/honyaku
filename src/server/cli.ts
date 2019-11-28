import yargs, { Arguments } from "yargs";

interface CliArgumentsDefinition {
  prod: boolean;
}

export type CliArguments = {
  [key in keyof Arguments<CliArgumentsDefinition>]: Arguments<
    CliArgumentsDefinition
  >[key];
};

export function processCli(): CliArguments {
  return yargs.options({
    prod: { type: "boolean", default: false }
  }).argv;
}
