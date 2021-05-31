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
const util_1 = require("./util");
const path_1 = require("path");
/**
 * Factory for JSHookLoaders.
 *
 * @param {RepostContext} ctx
 * @returns {JSHookLoader}
 */
function hookFactory(ctx) {
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
        loadHooks(filename) {
            return __awaiter(this, void 0, void 0, function* () {
                let before, after;
                try {
                    if (!filename.endsWith(".js")) {
                        filename = util_1.replaceExtension(filename, ".js");
                    }
                    const code = yield util_1.readFile(filename);
                    // TODO -- for custom JS tests, this results in the module being evaluated twice.
                    const exported = code ? (yield ctx.evalModule(code)) || {} : {};
                    before = exported.before;
                    after = exported.after;
                }
                finally {
                    return {
                        before: before || (x => x),
                        after: after || (x => x)
                    };
                }
            });
        },
        /**
         * Tries to determine whether `filename` is a hooks file.
         *
         * @param {string} filename
         * @returns {Promise<boolean>}
         * @memberof JSHookLoader#
         */
        isHookFile(filename) {
            return __awaiter(this, void 0, void 0, function* () {
                const ext = path_1.extname(filename);
                if (ext !== ".js")
                    return false;
                if (ctx.envs.isEnvFile(filename))
                    return false;
                const base = path_1.basename(filename, ext);
                const baseWithExt = path_1.basename(filename);
                for (const sib of yield util_1.readDir(path_1.dirname(filename))) {
                    const sibBase = path_1.basename(sib, path_1.extname(sib));
                    const sibBaseWithExt = path_1.basename(sib);
                    if (sibBase === base && sibBaseWithExt !== baseWithExt) {
                        return true;
                    }
                }
                return false;
            });
        }
    };
    return self;
}
exports.hookFactory = hookFactory;
//# sourceMappingURL=hooks.js.map