/**
 * @module repost/log
 */
module.exports = {
  loggerFactory
};

/**
 * Logger factory
 *
 * @param {RepostContext} ctx
 * @returns {Logger}
 */
function loggerFactory(ctx) {
  const { config } = ctx;

  const log = (level, ...args) => {
    if (config.silent || config.verbosity < level) return;
    config.console.log(...args);
  };

  /**
   * Provides methods for logging information at various levels.
   *
   * @interface Logger
   * @global
   */
  return {
    /**
     * Logs a warning message
     *
     * @param {*} args
     * @memberof Logger#
     */
    warn(...args) {
      if (!config.silent) config.console.warn(...args);
    },

    /**
     * Logs an error message
     *
     * @param {*} args
     * @memberof Logger#
     */
    error(...args) {
      if (!config.silent) config.console.error(...args);
    },

    /**
     * Logs an information message (verbosity level 0)
     *
     * @param {*} args
     * @memberof Logger#
     */
    info(...args) {
      log(0, ...args);
    },

    /**
     *Logs a verbose message (verbosity level 1)
     *
     * @param {*} args
     * @memberof Logger#
     */
    verbose(...args) {
      log(1, ...args);
    },

    /**
     * Logs a debug message (verbosity level 2)
     *
     * @param {*} args
     * @memberof Logger#
     */
    debug(...args) {
      log(2, ...args);
    },

    /**
     * Logs a silly message (verbosity level 3)
     *
     * @param {*} args
     * @memberof Logger#
     */
    silly(...args) {
      log(3, ...args);
    }
  };
}
