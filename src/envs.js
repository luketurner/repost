const path = require("path");
const util = require("./util");

module.exports = session => {
  const getEnvLocationForRequest = test =>
    path.join(path.dirname(test), "default.env.json");

  const getEnvJS = async envName => {
    try {
      return await util.readFile(envName.slice(0, -2), "utf8");
    } catch (err) {
      if (err.code === "ENOENT") return null;
      else throw err;
    }
  };

  const getEnvJSON = async envName => {
    try {
      const json = await util.readFile(envName, "utf8");
      const env = JSON.parse(json);
      if (env === null || typeof env !== "object") return {};
      return env;
    } catch (err) {
      if (err.code === "ENOENT") return {};
      else throw err;
    }
  };

  const getEnv = async (envName, context) => {
    session.log.silly(`getEnv(${envName})`);

    const [envJSRaw, envJSON] = await Promise.all([
      getEnvJS(envName),
      getEnvJSON(envName)
    ]);

    const envJS = envJSRaw
      ? await util.eval(envJSRaw, { env: envJSON, session, context })
      : {};

    const env = { ...envJS, ...envJSON };
    return env;
  };

  const patchEnv = async (envName, patch) => {
    session.log.silly(`patchEnv(${envName})`);
    const oldEnv = await getEnvJSON(envName);
    const newEnv = Object.assign(oldEnv, patch);
    await util.writeFile(envName, JSON.stringify(newEnv, null, 2));
    return newEnv;
  };

  const getEnvForRequest = request => getEnv(getEnvLocationForRequest(request));
  const patchEnvForRequest = (request, patch) =>
    patchEnv(getEnvLocationForRequest(request), patch);

  return {
    getEnv,
    getEnvForRequest,
    patchEnv,
    patchEnvForRequest
  };
};
