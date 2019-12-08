const { exec, AppError } = require("cli-of-mine");

const packageJson = require("../../package.json");

const repost = require("..");

module.exports = { cli };

async function cli(config) {
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

    options: require("./options"),

    subcommands: [require("./commands/run")],

    resources: [
      require("./resources/collection"),
      require("./resources/request"),
      require("./resources/environment")
    ]
  });
}

function getBaseHandler(config) {
  return async (ctx, next) => {
    if (!ctx.subcommand) {
      throw new AppError("MISSING_SUBCOMMAND", "Usage: repost COMMAND");
    }

    const baseContext =
      config.context ||
      (await repost.createContext({
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
