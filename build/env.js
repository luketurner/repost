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
const lodash_1 = require("lodash");
const DEFAULT_ENVIRONMENT = "default.env.json";
/**
 * Factory function for EnvLoader.
 *
 * @param {RepostContext} ctx
 * @returns {EnvLoader}
 */
function envsFactory(ctx) {
    /**
     * @interface EnvLoader
     */
    const self = {
        /**
         * Indicates whether `filename` is an environment file.
         *
         * Unlike other functions, this will not attempt to append `.env.json`
         * to `filename` if it is missng.
         *
         * @param {*} filename
         * @returns {boolean}
         */
        isEnvFile(filename) {
            return filename.endsWith(".env.js") || filename.endsWith(".env.json");
        },
        resolveEnvironment(requestFile) {
            return __awaiter(this, void 0, void 0, function* () {
                // TODO -- this logic is incomplete, should walk parent directories too.
                const dir = path_1.dirname(requestFile);
                const envFilename = path_1.join(dir, DEFAULT_ENVIRONMENT);
                if (yield util_1.accessFile(envFilename)) {
                    return envFilename;
                }
                return;
            });
        },
        getEnvironmentProxy(envName) {
            return __awaiter(this, void 0, void 0, function* () {
                const persist = lodash_1.throttle((property, value) => __awaiter(this, void 0, void 0, function* () {
                    // TODO -- this is kinda problematic because it might have race conditions?
                    const oldEnv = yield self.getRawVariables(envName);
                    self.write(envName, Object.assign(Object.assign({}, oldEnv), { [property]: value }));
                }), 100);
                return new Proxy(yield self.getEnvironment(envName, context), {
                    set(target, property, value, receiver) {
                        // TODO -- add validation that things like functions aren't being added
                        // asynchronously persist changes (props starting with __ are ignored for internal usage)
                        if (!property.toString().startsWith("__")) {
                            persist(property, value);
                        }
                        return Reflect.set(target, property, value, receiver);
                    }
                });
            });
        },
        getEnvironment(envName, context) {
            return __awaiter(this, void 0, void 0, function* () {
                return Object.assign(Object.assign({}, (yield self.getComputedVariables(envName, context))), (yield self.getRawVariables(envName)));
            });
        },
        getComputedVariables(envName, context) {
            return __awaiter(this, void 0, void 0, function* () {
                if (envName.endsWith(".env.json")) {
                    envName = envName.slice(0, -2);
                }
                if (!envName.endsWith(".env.js")) {
                    envName += ".env.js";
                }
                try {
                    const code = yield util_1.readFile(envName, "utf8");
                    if (!code)
                        return {};
                    return yield context.evalModule(code);
                }
                catch (err) {
                    if (err.code === "ENOENT")
                        return null;
                    else
                        throw err;
                }
            });
        },
        getRawVariables(envName) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!envName.endsWith(".env.json")) {
                    envName += ".env.json";
                }
                try {
                    const json = yield util_1.readFile(envName, "utf8");
                    const env = JSON.parse(json);
                    if (env === null || typeof env !== "object")
                        return {};
                    return env;
                }
                catch (err) {
                    if (err.code === "ENOENT")
                        return {};
                    else
                        throw err;
                }
            });
        },
        write(envName, envObject) {
            return __awaiter(this, void 0, void 0, function* () {
                return util_1.writeFile(envName, JSON.stringify(envObject, null, 2));
            });
        },
        patch(envName, patchObject) {
            return __awaiter(this, void 0, void 0, function* () {
                const newEnv = Object.assign(Object.assign({}, (yield self.getRawVariables(envName))), patchObject);
                yield self.write(envName, newEnv);
                return newEnv;
            });
        },
        create(envName, envObject) {
            return __awaiter(this, void 0, void 0, function* () {
                if (envName.endsWith(".env.js")) {
                    throw new Error("scaffold doesn't support .env.js files yet");
                }
                if (!envName.endsWith(".env.json")) {
                    envName += ".env.json";
                }
                if (yield util_1.accessFile(envName)) {
                    throw new Error(`Cannot create environment: ${envName} already exists.`);
                }
                return self.write(envName, envObject);
            });
        }
    };
    return self;
}
exports.envsFactory = envsFactory;
//# sourceMappingURL=env.js.map