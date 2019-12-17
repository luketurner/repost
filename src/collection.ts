import { join as joinPath } from "path";
import { mkdir, accessFile, statFile, writeFile, readDir } from "./util";

/**
 * CollectionHelper factory.
 *
 * @param {RepostContext} ctx
 * @returns {CollectionHelper}
 */
export function collectionFactory(ctx) {
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

      if (!(await accessFile(dirname))) {
        await mkdir(dirname);
      } else if ((await statFile(dirname)).isFile()) {
        throw new Error(
          'Cannot create collection: "' + dirname + '" is not a directory'
        );
      }

      await writeFile(joinPath(dirname, self.indicatorFile), "");
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
        return await accessFile(joinPath(dirname, self.indicatorFile));
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
      const filesInCollection = await readDir(dirname);
      const requestFiles = [];
      for (const f of filesInCollection) {
        if (f === self.indicatorFile) continue;
        if (await ctx.request.isRequest(joinPath(dirname, f))) {
          requestFiles.push(f);
        }
      }
      return requestFiles;
    }
  };

  return self;
}
