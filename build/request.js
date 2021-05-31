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
        tryRun(filename) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    return { response: yield self.run(filename), request: filename };
                }
                catch (e) {
                    return { error: e, request: filename };
                }
            });
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
        run(filename) {
            return __awaiter(this, void 0, void 0, function* () {
                const { before, after } = yield ctx.hooks.loadHooks(filename);
                let request = yield ctx.format.parse(filename);
                request = yield before(request);
                let response = yield request.handler(request);
                response = yield after(response);
                return response;
            });
        },
        /**
         * Checks whether the file seems like a valid Repost request.
         *
         * @param {string} filename
         * @returns {Promise<boolean>}
         * @memberof FileRequestRunner#
         */
        isRequest(filename) {
            return __awaiter(this, void 0, void 0, function* () {
                if (ctx.envs.isEnvFile(filename))
                    return false;
                if (yield ctx.hooks.isHookFile(filename))
                    return false;
                if (ctx.format.isSupportedExtension(path_1.extname(filename)))
                    return true;
                return false;
            });
        },
        /**
         * Creates a new request, writing it to the specified filename. Returns the content of the file as a string.
         *
         * @param {string} filename
         * @returns {Promise<string>}
         * @memberof FileRequestRunner#
         */
        create(filename, format, request) {
            return __awaiter(this, void 0, void 0, function* () {
                ctx.log.silly(`request.create(${filename})`);
                if (yield util_1.accessFile(filename)) {
                    throw new Error(`Cannot create request: "${filename}" already exists.`);
                }
                const printedRequest = ctx.format.print(request, format);
                yield util_1.writeFile(filename, printedRequest);
                return printedRequest;
            });
        }
    };
    return self;
}
exports.requestFactory = requestFactory;
//# sourceMappingURL=request.js.map