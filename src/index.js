const makeLog = require("./log");
const makeEnvs = require("./envs");
const makeHooks = require("./hooks");
const makeParser = require("./request-parser");
const makeRun = require("./run");
const util = require("./util");

/**
 * Creates and returns a new session object.
 *
 * Accepts the following config:
 *  - verbose: [0, 1, 2, 3]
 *  - raw: [true, false]
 *  - silent: [true, false]
 *
 * @param {*} config
 * @returns
 */
const newSession = config => {
  config = config || {};

  // Set default values
  config = {
    verbose: 0, // 0, 1, 2, 3
    raw: false,
    silent: false,
    ...config
  };

  const session = { config };

  // Modules must be instantiated in specific order based on internal coupling. Should be fixed
  session.util = util;
  session.log = makeLog(session);
  session.envs = makeEnvs(session);
  session.hooks = makeHooks(session);
  session.parser = makeParser(session);
  session.run = makeRun(session);

  return session;
};

const cli = async () => {
  try {
    await require("../src/cli")();
  } catch (e) {
    console.error(e);
  }
};

module.exports = { newSession, cli };
