const path = require("path");
const util = require("./util");

const fs = require("fs");
const _ = require("lodash");

const DEFAULT_ENVIRONMENT = "default.env.json";

/**
 * @module env
 * @private
 */
module.exports = {
  resolveEnvironment,
  getEnvironmentProxy,
  getEnvironment
};

async function resolveEnvironment(requestFile) {
  // TODO -- this logic is incomplete, should walk parent directories too.
  const dirname = path.dirname(requestFile);
  const envFilename = path.join(dirname, DEFAULT_ENVIRONMENT);
  if (await util.accessFile(envFilename)) {
    return envFilename;
  }

  return null;
}

async function getEnvironmentProxy(envName, context) {
  const persist = _.throttle(target => {
    write(envName, JSON.stringify(target, null, 2));
  }, 100);
  return new Proxy(await getEnvironment(envName, context), {
    set(target, property, value, receiver) {
      // TODO -- add validation that things like functions aren't being added

      // asynchronously persist changes (props starting with __ are ignored for internal usage)
      if (!property.toString().startsWith("__")) {
        persist(target);
      }

      return Reflect.set(target, property, value, receiver);
    }
  });
}

async function getEnvironment(envName, context) {
  return {
    ...(await getComputedVariables(envName, context)),
    ...(await getRawVariables(envName))
  };
}

async function getComputedVariables(envName, context) {
  if (envName.endsWith(".env.json")) {
    envName = envName.slice(0, -2);
  }

  if (!envName.endsWith(".env.js")) {
    envName += ".env.js";
  }

  try {
    const code = await util.readFile(envName, "utf8");
    if (!code) return {};
    return await context.evalModule(code);
  } catch (err) {
    if (err.code === "ENOENT") return null;
    else throw err;
  }
}

async function getRawVariables(envName) {
  if (!envName.endsWith(".env.json")) {
    envName += ".env.json";
  }

  try {
    const json = await util.readFile(envName, "utf8");
    const env = JSON.parse(json);
    if (env === null || typeof env !== "object") return {};
    return env;
  } catch (err) {
    if (err.code === "ENOENT") return {};
    else throw err;
  }
}

async function write(envName, envObject) {
  return util.writeFile(envName, JSON.stringify(envObject, null, 2));
}

async function patch(envName, patchObject) {
  const newEnv = {
    ...(await getRawVariables(envName)),
    ...patchObject
  };
  await write(envName, newEnv);
  return newEnv;
}

// module.exports = session => {
//   const self = {
//     defaultEnvironment: "default.env.json",

//     /**
//      * Attempts to find an environment appropriate for use with request file `requestFile`.
//      *
//      * @param {*} requestFile
//      */
//     async resolve(requestFile) {
//       // TODO -- this logic is incomplete, should walk parent directories too.
//       const dirname = path.dirname(requestFile);
//       const envFilename = path.join(dirname, self.defaultEnvironment);

//       if (await util.accessFile(envFilename)) {
//         return envFilename;
//       }

//       return null;
//     },

//     /**
//      * Looks up the given environment, returning an object of key/value pairs representing all the variables in the environment, including computed variables.
//      *
//      * If the environment does not exist, an empty object is returned.
//      *
//      * @param {string} envName the name of the environment (the `.env.json` suffix is optional)
//      * @param {*} context an object that represents the runtime context for computed variables
//      * @returns {Promise<{ [key: string]: any }>}
//      */
//     async getVariables(envName, context) {
//       session.log.silly(`env.getVariables(${envName})`);

//       return {
//         ...self.getComputedVariables(envName, context),
//         ...self.getRawVariables(envName)
//       };
//     },

//     /**
//      * Evaluates the computed variables for given `envName` by executing the envName.env.js file as a module, and returning the object exported by that module.
//      *
//      * If the environment does not exist, an empty object is returned.
//      *
//      * @param {*} envName name of environment (the `.env.js` or `.env.json` suffixes are optional.)
//      * @param {*} context object representing the execution context for the computed variables
//      * @returns {Promise<{ [key: string]: any }>}
//      */
//     async getComputedVariables(envName, context) {
//       if (envName.endsWith(".env.json")) {
//         envName = envName.slice(0, -2);
//       }

//       if (!envName.endsWith(".env.js")) {
//         envName += ".env.js";
//       }

//       try {
//         const code = await util.readFile(envName.slice(0, -2), "utf8");
//         if (!code) return {};
//         return await util.eval(code, context);
//       } catch (err) {
//         if (err.code === "ENOENT") return null;
//         else throw err;
//       }
//     },

//     /**
//      * Returns the "raw" (non-computed) variables for given `envName` by reading the envName.env.json file.
//      *
//      * If the environment does not exist, an empty object is returned.
//      *
//      * @param {*} envName name of environment (the `.env.js` or `.env.json` suffixes are optional.)
//      * @param {*} context object representing the execution context for the computed variables
//      * @returns {Promise<{ [key: string]: any }>}
//      */
//     async getRawVariables(envName) {
//       if (!envName.endsWith(".env.json")) {
//         envName += ".env.json";
//       }

//       try {
//         const json = await util.readFile(envName, "utf8");
//         const env = JSON.parse(json);
//         if (env === null || typeof env !== "object") return {};
//         return env;
//       } catch (err) {
//         if (err.code === "ENOENT") return {};
//         else throw err;
//       }
//     },

//     /**
//      * Writes data to an environment. If the environment exists, any existing data is truncated before the new data is written.
//      *
//      * @param {*} envName name of environment (the `.env.json` suffix is optional.)
//      * @param {*} envObject data to use for new environment
//      */
//     async write(envName, envObject) {
//       session.log.silly(`env.write(${envName})`);
//       return util.writeFile(envName, JSON.stringify(envObject, null, 2));
//     },

//     async patch(envName, patchObject) {
//       const newEnv = {
//         ...(await self.getRawVariables(envName)),
//         ...patchObject
//       };
//       await self.write(envName, newEnv);
//       return newEnv;
//     }
//   };

//   return self;
// };
