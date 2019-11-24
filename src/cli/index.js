const parseArgs = require("command-line-args");

const { createContext } = require("..");
const BASE_OPTIONS = require("./options");
const COMMANDS = require("./commands");
const getHelp = require("./help");
const util = require("../util");
const { Writable } = require("stream");

const { promisify } = require("util");

const { Console } = require("console");

const parseBaseArgs = argv => {
  const args = parseArgs(BASE_OPTIONS, {
    stopAtFirstUnknown: true,
    camelCase: true,
    argv
  });
  args.verbose = args.verbose ? args.verbose.length : 0;

  return args;
};

const getCommandHandler = command => {
  if (!COMMANDS[command]) throw new Error("Unknown command: " + command);
  const { handler } = COMMANDS[command];
  return handler;
};

const parseCommandArgs = (command, argv) => {
  if (!COMMANDS[command]) throw new Error("Unknown command: " + command);
  const { options } = COMMANDS[command];
  return parseArgs(options, {
    argv,
    camelCase: true
  });
};

const withConsole = async (capture = false, fn) => {
  if (!capture) {
    return {
      result: await fn(console)
    };
  }

  const stdoutChunks = [];
  const stderrChunks = [];
  const stdout = new Writable({
    write(chunk, encoding, callback) {
      stdoutChunks.push(chunk);
      callback();
    }
  });
  const stderr = new Writable({
    write(chunk, encoding, callback) {
      stderrChunks.push(chunk);
      callback();
    }
  });

  const logConsole = new Console(stdout, stderr);

  const result = await fn(logConsole);

  await promisify(stdout.end.bind(stdout))();
  await promisify(stderr.end.bind(stderr))();

  return {
    result,
    stdout: Buffer.concat(stdoutChunks).toString("utf8"),
    stderr: Buffer.concat(stderrChunks).toString("utf8")
  };
};

module.exports = async (rawArgv, config) => {
  const { captureOutput = false, context = undefined } = config || {};

  return await withConsole(captureOutput, async console => {
    const baseArgs = parseBaseArgs(rawArgv);
    const { command, help } = baseArgs;

    if (help) return console.log(getHelp(command));
    if (!command) {
      console.log(getHelp(command));
      throw new Error("Usage: repost [command]");
    }

    const handler = getCommandHandler(command);
    const args = parseCommandArgs(command, baseArgs._unknown || []);

    const baseContext =
      context ||
      (await createContext({
        ...args,
        console
      }));

    if (context && captureOutput) {
      context.config.console = console;
    }

    await handler(baseContext, { ...baseArgs, ...args });

    return;
  });
};
