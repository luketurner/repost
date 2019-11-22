const parseArgs = require("command-line-args");

const { createContext } = require("..");
const BASE_OPTIONS = require("./options");
const COMMANDS = require("./commands");
const getHelp = require("./help");

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

module.exports = async rawArgv => {
  const baseArgs = parseBaseArgs(rawArgv);
  const { command, help } = baseArgs;

  if (help) return console.log(getHelp(command));
  if (!command) {
    console.log(getHelp(command));
    throw new Error("Usage: repost [command]");
  }

  const handler = getCommandHandler(command);
  const args = parseCommandArgs(command, baseArgs._unknown || []);

  const context = await createContext(args);

  return await handler(context, { ...baseArgs, ...args });
};
