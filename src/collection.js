const path = require("path");
const util = require("./util");

/**
 * @module collection
 * @private
 */
module.exports = { collectionFactory };

/**
 * CollectionHelper factory.
 *
 * @param {RepostContext} ctx
 * @returns {CollectionHelper}
 */
function collectionFactory(ctx) {
  /**
   * Collection helper module
   *
   * @global
   * @interface CollectionHelper
   */
  const self = {
    /**
     * File that must be present in a directory to identify it as a collection
     * @var {string}
     * @memberof CollectionHelper#
     */
    indicatorFile: ".repost-collection",

    /**
     * "Creates" a collection by adding an indicator file to the directory `dirname`. Will create
     * directory if it doesn't already exist.
     *
     * @param {string} dirname
     * @returns {Promise<void>}
     * @memberof CollectionHelper#
     */
    async create(dirname) {
      ctx.log.silly(`collection.create(${dirname})`);
      const s = await util.statFile(dirname);

      if (s.isFile()) {
        throw new Error(
          'Cannot create collection: "' + dirname + '" is not a directory'
        );
      }

      if (!s.isDirectory()) {
        await util.mkdir(dirname);
      }

      await util.writeFile(path.join(dirname, self.indicatorFile), "");
    },

    /**
     * Indicates whether `dirname` is a collection or not, based on the presence of indicator file.
     *
     * @param {string} dirname
     * @returns {Promise<boolean>}
     * @memberof CollectionHelper#
     */
    async isCollection(dirname) {
      try {
        return await util.accessFile(path.join(dirname, self.indicatorFile));
      } catch (e) {
        return false;
      }
    },

    /**
     * Returns all the requests contained within the collection `dirname`.
     * Note -- this does not verify whether `dirname` is a collection.
     *
     * @param {string} dirname
     * @returns {Promise<string[]>}
     * @memberof CollectionHelper#
     */
    async getRequests(dirname) {
      // TODO -- this should be recursing into subdirectories
      const filesInCollection = await util.readDir(dirname);
      return (
        filesInCollection
          .filter(f => f === self.indicatorFile)
          // .filter(f => !session.hook.isHookFile(f)) TODO
          .map(f => path.join(dirname, f))
      );
    }
  };

  return self;
}
