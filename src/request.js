const util = require("./util");
const path = require("path");
/**
 * @module repost/request
 */
module.exports = {
  requestFactory
};

/**
 * @interface TryRunResponse
 * @global
 * @property {Response} response
 * @property {Error} error
 * @property {string} request
 */

/**
 * FileRequestRunner factory.
 *
 * @param {RepostContext} ctx
 * @returns {FileRequestRunner}
 */
function requestFactory(ctx) {
  /**
   * The FileRequestRunner provides methods relating to reading and executing requests stored on the filesystem.
   *
   * @interface FileRequestRunner
   * @global
   */
  const self = {
    /**
     * Like {@link FileRequestRunner#run}, but the promise it returns will never reject.
     * Instead, it resolves with an object that has either a `response` property if the request was successful,
     * or an `error` property if the request failed. The request filename itself is also included in the resolved object.
     *
     * This is especially useful when using `Promise.all` to run multiple requests, without having an error in a single request short-circuit the others.
     *
     * @param {string} filename
     * @returns {Promise<TryRunResponse>}
     * @memberof FileRequestRunner#
     */
    async tryRun(filename) {
      try {
        return { response: await self.run(filename), request: filename };
      } catch (e) {
        return { error: e, request: filename };
      }
    },

    /**
     * Runs the request specified by `filename`. If `filename` doesn't point to an appropriate Repost request file, or if
     * an error occurs during request execution, the returned promise will reject. If the request succeeds, the return promise
     * will resolve with the Response object.
     *
     * @param {string} filename
     * @returns {Promise<Response>}
     * @memberof FileRequestRunner#
     */
    async run(filename) {
      const { before, after } = await ctx.hooks.loadHooks(filename);

      let request = await ctx.format.parse(filename);
      request = await before(request);

      let response = await request.handler(request);
      response = await after(response);

      return response;
    },

    /**
     * Checks whether the file seems like a valid Repost request.
     *
     * @param {string} filename
     * @returns {Promise<boolean>}
     * @memberof FileRequestRunner#
     */
    async isRequest(filename) {
      if (ctx.envs.isEnvFile(filename)) return false;
      if (await ctx.hooks.isHookFile(filename)) return false;
      if (ctx.format.isSupportedExtension(path.extname(filename))) return true;
      return false;
    },

    /**
     * Creates a new request, writing it to the specified filename. Returns the content of the file as a string.
     *
     * @param {string} filename
     * @returns {Promise<string>}
     * @memberof FileRequestRunner#
     */
    async create(filename, format, request) {
      ctx.log.silly(`request.create(${filename})`);

      if (await util.accessFile(filename)) {
        throw new Error(`Cannot create request: "${filename}" already exists.`);
      }

      const printedRequest = ctx.format.print(request, format);

      await util.writeFile(filename, printedRequest);

      return printedRequest;
    }
  };

  return self;
}
