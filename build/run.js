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
    return (filenames) => __awaiter(this, void 0, void 0, function* () {
        const promises = [];
        for (const file of filenames) {
            if (yield ctx.collection.isCollection(file)) {
                const filesInCollection = yield ctx.collection.getRequests(file);
                promises.push(...filesInCollection.map(ctx.request.tryRun));
            }
            else if (yield ctx.request.isRequest(file)) {
                promises.push(ctx.request.tryRun(file));
            }
            else {
                throw new Error(`File ${file} is not a valid repost request.`);
            }
        }
        return Promise.all(promises);
    });
}
exports.runnerFactory = runnerFactory;
//# sourceMappingURL=run.js.map