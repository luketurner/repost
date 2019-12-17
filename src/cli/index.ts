import { exec, AppError } from "cli-of-mine";

import { createContext } from "..";

import { options } from "./options";
import { run } from "./commands/run";
import { collection } from "./resources/collection";
import { environment } from "./resources/environment";
import { request } from "./resources/request";

// a little odd. Don't actually compile/copy this file to the output directory, just reference it
// (the path is the same from source vs. built code)
const packageJson = require("../../package.json");

export async function cli(config) {
  config = {
    ...config
  };
  return exec({
    name: packageJson.name,
    description: packageJson.description,
    version: packageJson.version,

    stdin: config.stdin,
    stdout: config.stdout,
    stderr: config.stderr,
    argv: config.argv,
    errorStrategy: config.errorStrategy,

    examples: ["repost run foo.http"],

    handler: getBaseHandler(config),

    options: options,

    subcommands: [run],

    resources: [collection, environment, request]
  });
}

function getBaseHandler(config) {
  return async (ctx, next) => {
    if (!ctx.subcommand) {
      throw new AppError("MISSING_SUBCOMMAND", "Usage: repost COMMAND");
    }

    const baseContext =
      config.context ||
      (await createContext({
        ...ctx.args,
        console: ctx.console
      }));

    if (config.context) {
      config.context.config.console = ctx.console;
    }

    ctx.data.repostContext = baseContext;
    return next();
  };
}
