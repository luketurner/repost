const util = require("./util");

module.exports = session => {
  const getRequestHooks = async test => {
    session.log.silly(`getTestHooks(${test})`);
    const evalScope = {
      env: await session.envs.getEnvForRequest(test),
      repost: session
    };

    const defaultHooks = {
      before: x => x,
      after: x => x
    };

    let rawText;
    try {
      rawText = await util.readFile(util.replaceExtension(test, "js"), "utf8");
    } catch (e) {
      session.log.debug("No hooks found for test:", test);
      return defaultHooks;
    }
    const hooks = await util.eval(rawText, evalScope);
    if (hooks === null || typeof hooks !== "object") return defaultHooks;

    return Object.assign(defaultHooks, hooks);
  };

  return { getTestHooks: getRequestHooks };
};
