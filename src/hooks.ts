import { replaceExtension, readFile, readDir } from "./util";
import { extname, dirname, basename } from "path";

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
export function hookFactory(ctx) {
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
          filename = replaceExtension(filename, ".js");
        }

        const code = await readFile(filename);

        // TODO -- for custom JS tests, this results in the module being evaluated twice.
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
      const ext = extname(filename);
      if (ext !== ".js") return false;

      if (ctx.envs.isEnvFile(filename)) return false;

      const base = basename(filename, ext);
      const baseWithExt = basename(filename);

      for (const sib of await readDir(dirname(filename))) {
        const sibBase = basename(sib, extname(sib));
        const sibBaseWithExt = basename(sib);
        if (sibBase === base && sibBaseWithExt !== baseWithExt) {
          return true;
        }
      }
      return false;
    }
  };

  return self;
}
