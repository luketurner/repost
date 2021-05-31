/**
 * CollectionHelper factory.
 *
 * @param {RepostContext} ctx
 * @returns {CollectionHelper}
 */
export declare function collectionFactory(ctx: any): {
    /**
     * File that must be present in a directory to identify it as a collection
     * @var {string}
     * @memberof CollectionHelper#
     */
    indicatorFile: string;
    /**
     * "Creates" a collection by adding an indicator file to the directory `dirname`. Will create
     * directory if it doesn't already exist.
     *
     * @param {string} dirname
     * @returns {Promise<void>}
     * @memberof CollectionHelper#
     */
    create(dirname: any): Promise<void>;
    /**
     * Indicates whether `dirname` is a collection or not, based on the presence of indicator file.
     *
     * @param {string} dirname
     * @returns {Promise<boolean>}
     * @memberof CollectionHelper#
     */
    isCollection(dirname: any): Promise<boolean>;
    /**
     * Returns all the requests contained within the collection `dirname`.
     * Note -- this does not verify whether `dirname` is a collection.
     *
     * @param {string} dirname
     * @returns {Promise<string[]>}
     * @memberof CollectionHelper#
     */
    getRequests(dirname: any): Promise<string[]>;
};
//# sourceMappingURL=collection.d.ts.map