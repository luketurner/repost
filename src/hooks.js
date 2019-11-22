const path = require("path");
const util = require("./util");

/**
 * @module repost/hooks
 */
module.exports = {
  hookFactory
};

/**
 * @interface Hooks
 * @global
 * @property {Function} before (request) => transformedRequest
 * @property {Function} after (response) => transformedResponse
 */

/**
 * Factory for JSHookLoaders.
 *
 * @param {RepostContext} ctx
 * @returns {JSHookLoader}
 */
function hookFactory(ctx) {
  /**
   * The JSHookLoader contains logic for loading hooks from JS "hook files."
   *
   * @global
   * @interface JSHookLoader
   */
  const self = {
    /**
     * Loads the hooks given in `filename` within the loader's RepostContext. Returns an object with the before and after functions.
     *
     * @param {string} filename
     * @returns {Promise<Hooks>}
     * @memberof JSHookLoader#
     */
    async loadHooks(filename) {
      let before, after;
      try {
        if (!filename.endsWith(".js")) {
          filename = util.replaceExtension(filename, ".js");
        }

        const code = await util.readFile(filename);

        // TODO -- this results in hooks being executed in a different context from handler in raw `.js` tests.
        const exported = code ? (await ctx.evalModule(code)) || {} : {};

        before = exported.before;
        after = exported.after;
      } finally {
        return {
          before: before || (x => x),
          after: after || (x => x)
        };
      }
    },

    /**
     * Tries to determine whether `filename` is a hooks file.
     *
     * @param {string} filename
     * @returns {Promise<boolean>}
     * @memberof JSHookLoader#
     */
    async isHookFile(filename) {
      const ext = path.extname(filename);
      if (ext !== ".js") return false;

      const basename = path.basename(filename, ext);
      const basename_with_ext = path.basename(filename);

      for (const sib of await util.readDir(path.dirname(filename))) {
        const sib_basename = path.basename(sib, path.extname(sib));
        const sib_basename_with_ext = path.basename(sib);
        if (
          sib_basename === basename &&
          sib_basename_with_ext !== basename_with_ext
        ) {
          return true;
        }
      }
      return false;
    }
  };

  return self;
}
