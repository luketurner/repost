const util = require("./util");
const path = require("path");

/**
 * @module repost/run
 */
module.exports = {
  runnerFactory
};

/**
 * Runner factory.
 *
 * @param {*} ctx
 * @returns {*}
 */
function runnerFactory(ctx) {
  /**
   * (Note -- this interface is a single function.)
   *
   * Accepts an array of filenames, which may be requests or collections, and runs them all in parallel.
   * Returns a Promise for an array of results, where each result is an object with either an `error`, or a `response` property.
   * @param {string[]} filenames
   * @returns {Promise<Array<TryRunResponse>>}
   */
  return async filenames => {
    const promises = [];

    for (const file of filenames) {
      if (await ctx.collection.isCollection(file)) {
        const filesInCollection = await ctx.collection.getRequests(file);
        promises.push(...filesInCollection.map(ctx.request.tryRun));
      } else if (await ctx.request.isRequest(file)) {
        promises.push(ctx.request.tryRun(file));
      } else {
        throw new Error(`File ${file} is not a valid repost request.`);
      }
    }

    return Promise.all(promises);
  };
}
