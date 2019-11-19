const path = require("path");
const util = require("./util");

module.exports = session => {
  const collection = {
    // File that must be present in a directory to identify it as a collection
    indicatorFile: ".repost-collection",

    /**
     * "Creates" a collection by adding an indicator file to the directory `dirname`. Will create
     * directory if it doesn't already exist.
     *
     * @param {string} dirname
     * @returns {Promise<void>}
     */
    async create(dirname) {
      const s = await util.statFile(dirname);

      if (s.isFile()) {
        throw new Error(
          'Cannot create collection: "' + dirname + '" is not a directory'
        );
      }

      if (!s.isDirectory()) {
        await util.mkdir(dirname);
      }

      await util.writeFile(path.join(dirname, collection.indicatorFile), "");
    },

    /**
     * Indicates whether `dirname` is a collection or not.
     *
     * @param {string} dirname
     * @returns {Promise<boolean>}
     */
    async isCollection(dirname) {
      try {
        await util.accessFile(path.join(dirname, collection.indicatorFile));
        return true;
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
     */
    async getRequests(dirname) {
      const filesInCollection = await util.readDir(dirname);
      return (
        filesInCollection
          .filter(f => f === collection.indicatorFile)
          // .filter(f => !session.hook.isHookFile(f)) TODO
          .map(f => path.join(dirname, f))
      );
    }
  };

  return collection;
};
