import { dirname, join as joinPath } from "path";
import { accessFile, readFile, writeFile } from "./util";
import { throttle } from "lodash";

const DEFAULT_ENVIRONMENT = "default.env.json";

/**
 * Factory function for EnvLoader.
 *
 * @param {RepostContext} ctx
 * @returns {EnvLoader}
 */
export function envsFactory(ctx) {
  /**
   * @interface EnvLoader
   */
  const self = {
    /**
     * Indicates whether `filename` is an environment file.
     *
     * Unlike other functions, this will not attempt to append `.env.json`
     * to `filename` if it is missng.
     *
     * @param {*} filename
     * @returns {boolean}
     */
    isEnvFile(filename) {
      return filename.endsWith(".env.js") || filename.endsWith(".env.json");
    },

    async resolveEnvironment(requestFile) {
      // TODO -- this logic is incomplete, should walk parent directories too.
      const dir = dirname(requestFile);
      const envFilename = joinPath(dir, DEFAULT_ENVIRONMENT);
      if (await accessFile(envFilename)) {
        return envFilename;
      }

      return null;
    },

    async getEnvironmentProxy(envName, context) {
      const persist = throttle(async (property, value) => {
        // TODO -- this is kinda problematic because it might have race conditions?
        const oldEnv = await self.getRawVariables(envName);
        self.write(envName, { ...oldEnv, [property]: value });
      }, 100);
      return new Proxy(await self.getEnvironment(envName, context), {
        set(target, property, value, receiver) {
          // TODO -- add validation that things like functions aren't being added

          // asynchronously persist changes (props starting with __ are ignored for internal usage)
          if (!property.toString().startsWith("__")) {
            persist(property, value);
          }

          return Reflect.set(target, property, value, receiver);
        }
      });
    },

    async getEnvironment(envName, context) {
      return {
        ...(await self.getComputedVariables(envName, context)),
        ...(await self.getRawVariables(envName))
      };
    },

    async getComputedVariables(envName, context) {
      if (envName.endsWith(".env.json")) {
        envName = envName.slice(0, -2);
      }

      if (!envName.endsWith(".env.js")) {
        envName += ".env.js";
      }

      try {
        const code = await readFile(envName, "utf8");
        if (!code) return {};
        return await context.evalModule(code);
      } catch (err) {
        if (err.code === "ENOENT") return null;
        else throw err;
      }
    },

    async getRawVariables(envName) {
      if (!envName.endsWith(".env.json")) {
        envName += ".env.json";
      }

      try {
        const json = await readFile(envName, "utf8");
        const env = JSON.parse(json);
        if (env === null || typeof env !== "object") return {};
        return env;
      } catch (err) {
        if (err.code === "ENOENT") return {};
        else throw err;
      }
    },

    async write(envName, envObject) {
      return writeFile(envName, JSON.stringify(envObject, null, 2));
    },

    async patch(envName, patchObject) {
      const newEnv = {
        ...(await self.getRawVariables(envName)),
        ...patchObject
      };
      await self.write(envName, newEnv);
      return newEnv;
    },

    async create(envName, envObject) {
      if (envName.endsWith(".env.js")) {
        throw new Error("scaffold doesn't support .env.js files yet");
      }
      if (!envName.endsWith(".env.json")) {
        envName += ".env.json";
      }

      if (await accessFile(envName)) {
        throw new Error(
          `Cannot create environment: ${envName} already exists.`
        );
      }
      return self.write(envName, envObject);
    }
  };
  return self;
}
