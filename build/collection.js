"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const util_1 = require("./util");
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
        create(dirname) {
            return __awaiter(this, void 0, void 0, function* () {
                ctx.log.silly(`collection.create(${dirname})`);
                if (!(yield util_1.accessFile(dirname))) {
                    yield util_1.mkdir(dirname);
                }
                else if ((yield util_1.statFile(dirname)).isFile()) {
                    throw new Error('Cannot create collection: "' + dirname + '" is not a directory');
                }
                yield util_1.writeFile(path_1.join(dirname, self.indicatorFile), "");
            });
        },
        /**
         * Indicates whether `dirname` is a collection or not, based on the presence of indicator file.
         *
         * @param {string} dirname
         * @returns {Promise<boolean>}
         * @memberof CollectionHelper#
         */
        isCollection(dirname) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    return yield util_1.accessFile(path_1.join(dirname, self.indicatorFile));
                }
                catch (e) {
                    return false;
                }
            });
        },
        /**
         * Returns all the requests contained within the collection `dirname`.
         * Note -- this does not verify whether `dirname` is a collection.
         *
         * @param {string} dirname
         * @returns {Promise<string[]>}
         * @memberof CollectionHelper#
         */
        getRequests(dirname) {
            return __awaiter(this, void 0, void 0, function* () {
                // TODO -- this should be recursing into subdirectories
                const filesInCollection = yield util_1.readDir(dirname);
                const requestFiles = [];
                for (const f of filesInCollection) {
                    if (f === self.indicatorFile)
                        continue;
                    if (yield ctx.request.isRequest(path_1.join(dirname, f))) {
                        requestFiles.push(f);
                    }
                }
                return requestFiles;
            });
        }
    };
    return self;
}
exports.collectionFactory = collectionFactory;
//# sourceMappingURL=collection.js.map