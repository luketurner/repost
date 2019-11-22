const commandLineUsage = require("command-line-usage");
const packageJson = require("../../package.json");

const COMMANDS = require("./commands");
const BASE_OPTIONS = require("./options");

const getCommandListHelp = () => ({
  header: "Command List",
  content: Object.keys(COMMANDS).map(cmd => ({
    name: cmd,
    content: COMMANDS[cmd].description
  }))
});

const getCommandOptions = cmd => ({
  header: "Command Options",
  optionList: COMMANDS[cmd].options
});

const getCommandHelp = cmd => ({
  header: `${packageJson.name} ${cmd}`,
  content: COMMANDS[cmd].description
});

const getCommandExample = cmd => ({
  header: "Examples",
  content: COMMANDS[cmd].example
});

const getExamples = () => ({
  header: "Examples",
  content: ["repost run foo.http"]
});

const getDescription = () => ({
  header: packageJson.name,
  content: packageJson.description
});

const getOptionsHelp = () => ({
  header: "Base Options",
  optionList: BASE_OPTIONS,
  hide: "command"
});

module.exports = cmd =>
  commandLineUsage([
    cmd ? getCommandHelp(cmd) : getDescription(),
    cmd ? getCommandExample(cmd) : getExamples(),
    cmd ? getCommandOptions(cmd) : getCommandListHelp(),
    getOptionsHelp()
  ]);
