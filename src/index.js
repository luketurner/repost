const util = require("./util");

const vm = require("vm");
const _ = require("lodash");

const { collectionFactory } = require("./collection");
const { loggerFactory } = require("./log");
const { runnerFactory } = require("./run");
const { formatFactory } = require("./format");
const { hookFactory } = require("./hooks");
const { requestFactory } = require("./request");
const { envsFactory } = require("./env");

/**
 * @module repost
 */
module.exports = {
  createContext,
  cli
};

/**
 * @interface RepostConfig
 * @global
 * @property {string} env
 * @property {boolean} silent
 */

/**
 * Creates and returns a new RepostContext object.
 *
 * @param {RepostConfig} config
 * @returns {Promise<RepostContext>}
 */
// TODO -- can we stop having to make this async?
async function createContext(config) {
  config = config || {};

  // Set default values
  config = {
    verbosity: 0, // 0, 1, 2, 3
    silent: false,
    env: null,
    ...config
  };

  /**
   * RepostContext
   * @interface RepostContext
   * @global
   */
  const ctx = vm.createContext({
    /**
     * Lodash instance for user scripting
     * @property _
     * @memberof RepostContext
     * @instance
     */
    _,

    /**
     * The config that this RepostContext was initialized with (plus default values)
     * @property {RepostConfig} config
     * @memberof RepostContext
     * @instance
     */
    config,

    /**
     * Provides access to the `util` module for user scripting
     * @property {module:repost/util} util
     * @memberof RepostContext
     * @instance
     */
    util,

    /**
     * Evaluates a string of code, containing a commonjs module, within this RepostContext.
     *
     * The return value will be whatever the code set as the `module.exports` -- or if `module.exports`
     * is a function, that function will be executed (with `await`).
     *
     * @param {string} code
     * @returns {Promise<*>}
     * @memberof RepostContext
     * @instance
     */
    async evalModule(code) {
      // TODO -- best way to do this? Kinda worried about async code being run in the child context...
      // We could create a new context each time, but I sort of like the idea of having them shared, for some reason.
      const ctxModule = { exports: {} };
      ctx.module = ctxModule;
      vm.runInContext(code, ctx);
      delete ctx.module;
      let result = ctxModule && ctxModule.exports;
      if (typeof result === "function") {
        result = await result();
      }
      return result;
    }
  });

  ctx.log = loggerFactory(ctx);
  ctx.format = formatFactory(ctx);
  ctx.hooks = hookFactory(ctx);
  ctx.collection = collectionFactory(ctx);
  ctx.request = requestFactory(ctx);
  ctx.run = runnerFactory(ctx);
  ctx.envs = envsFactory(ctx);
  ctx.env = config.env
    ? await ctx.envs.getEnvironmentProxy(config.env, ctx)
    : {};

  return ctx;
}

/**
 * Executes the Repost CLI using the current process's i/o and argv
 *
 * @returns {Promise<void>}
 *
 */
async function cli() {
  try {
    await require("../src/cli")();
  } catch (e) {
    console.error(e);
  }
}
