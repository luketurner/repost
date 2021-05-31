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
exports.cli = exports.runToString = exports.exec = exports.parseRequest = exports.execRun = exports.callHook = exports.loadRunEnvs = exports.loadRunHooks = exports.loadHook = exports.loadEnvironment = exports.loadJSON = exports.loadJS = exports.execRequest = exports.getNextRun = exports.addRun = exports.createRun = void 0;
const _ = require("lodash");
const got_1 = require("got");
const cli_of_mine_1 = require("cli-of-mine");
const path_1 = require("path");
const util_1 = require("./util");
const util = require("./util");
const http_1 = require("./http");
const vm_1 = require("vm");
/**
 * Creates a new Run object with given parameters.
 *
 * @param newRun The parameters for the run. Only `request` is required.
 * @returns A fully-populated, valid Run object
 */
function createRun(newRun) {
    if (!newRun.request)
        throw new Error('Invalid run: Must include request property');
    return {
        request: newRun.request,
        status: newRun.status || "pending",
        name: newRun.name || newRun.request,
        hookFiles: newRun.hookFiles || [],
        envFiles: newRun.envFiles || [],
        hooks: newRun.hooks || {},
        env: newRun.env || {}
    };
}
exports.createRun = createRun;
/**
 * Given parameters for a new Run, creates the Run and adds it to the provided Execution.
 * @param execution The execution to add run to
 * @param run Parameters for the run to add (only `request` is required)
 * @returns The Run that was created
 */
function addRun(execution, runParams) {
    const run = createRun(runParams);
    execution.runs.push(run);
    return run;
}
exports.addRun = addRun;
/**
 * Returns the next run that will be executed for a given Execution.
 *
 * Only runs with status "pending" are eligible for execution.
 *
 * @export
 * @param {Execution} execution The Execution to find a run for
 * @returns {(Run | undefined)} A run to execute if one is present -- otherwise, undefined
 */
function getNextRun(execution) {
    return execution.runs.find((r) => r.status === "pending");
}
exports.getNextRun = getNextRun;
/**
 * Accepts a Request object and executes the HTTP request it describes.
 *
 * The promise this function returns will never reject. It will always
 * resolve with a tuple: `[response, error]`. If the request was successful,
 * `response` will be present and `error` will be absent. If the request
 * failed, `error` will be present and `response` may or may not be
 * present.
 *
 * @export
 * @param {Request} request The Request to execute.
 * @returns {Promise<[Response?, Error?]>} A tuple of the response and error (if any).
 */
function execRequest(request) {
    return __awaiter(this, void 0, void 0, function* () {
        let response;
        try {
            response = yield got_1.default(Object.assign({}, request));
            response = _.pick(response, [
                'url', 'timings', 'statusCode', 'requestUrl', 'redirectUrls', 'ip',
                'isFromCache', 'body', 'retryCount', 'method', 'headers', 'rawHeaders', 'trailers', 'rawTrailers',
                'rawBody'
            ]); // TODO -- should make real type here
            return [response, undefined];
        }
        catch (e) {
            if (e.response)
                response = e.response;
            response = _.pick(response, [
                'url', 'timings', 'statusCode', 'requestUrl', 'redirectUrls', 'ip',
                'isFromCache', 'body', 'retryCount', 'method', 'headers', 'rawHeaders', 'trailers', 'rawTrailers',
                'rawBody'
            ]); // TODO -- should make real type here
            return [response, e];
        }
    });
}
exports.execRequest = execRequest;
/**
 * Reads a .js file and executes the contents in a separate context. Returns a Promise for whatever
 * value is returned by the JS object.
 *
 * @param filePath Path to JS
 * @param executionContext Object to use for execution context
 * @returns A Promise for whatever value was returned by the loaded JS
 */
function loadJS(filePath, executionContext) {
    return __awaiter(this, void 0, void 0, function* () {
        const content = yield util_1.readFile(filePath, { encoding: 'utf8' });
        return yield vm_1.compileFunction(content, [], {
            parsingContext: vm_1.createContext(executionContext)
        })();
    });
}
exports.loadJS = loadJS;
/**
 * Reads a .json file and parses the contents into a JSON object. Returns a Promise for the parsd JSON.
 *
 * @param filePath Path to parse
 * @returns A Promise for whatever value was present in the .json file
 */
function loadJSON(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        return JSON.parse(yield util_1.readFile(filePath, { encoding: 'utf8' }));
    });
}
exports.loadJSON = loadJSON;
/**
 * Loads an environment from given file (which may be JS or JSON). Returns the environment data.
 *
 * @param envPath The path to the environment file
 * @param executionContext An object to use as context when loading JS environments
 * @returns
 */
function loadEnvironment(envPath, executionContext) {
    return __awaiter(this, void 0, void 0, function* () {
        const ext = path_1.extname(envPath);
        if (!['.js', '.json'].includes(ext)) {
            throw new Error(`Invalid environment file: ${envPath}. Must be a .js or .json file`);
        }
        const env = ext === '.js' ? yield loadJS(envPath, executionContext) : yield loadJSON(envPath);
        if (typeof env !== 'object' || env === null)
            throw new Error(`Invalid environment file: ${envPath}. Must export a JS or JSON object.`);
        return env;
    });
}
exports.loadEnvironment = loadEnvironment;
/**
 * Loads a hook file, returning a Promise for the resulting RunHook object.
 *
 * @export
 * @param hookPath The path of the hook file to load
 * @param executionContext An object to use as context when loading the hook file
 * @returns
 */
function loadHook(hookPath, executionContext) {
    return __awaiter(this, void 0, void 0, function* () {
        const hook = yield loadJS(hookPath, executionContext);
        if (typeof hook !== 'object' || hook === null)
            throw new Error(`Invalid hook file: ${hookPath}. Must export a JS object.`);
        for (const [k, v] of Object.entries(hook)) {
            if (!Array.isArray(v)) {
                hook[k] = [v];
            } // convert single functions into arrays
            for (const f of hook[k]) {
                if (typeof f !== 'function')
                    throw new Error(`Invalid hook file: ${hookPath}. Hooks must be functions.`);
            }
        }
        return hook;
    });
}
exports.loadHook = loadHook;
/**
 * Loads all the hooks for a given run. If multiple files specify functions for the same hook type,
 * the function lists are all concatenated together.
 *
 * This mutates run.hooks and returns the mutated Run. Note that existing hooks will be retained.
 *
 * If any files cannot be loaded, this logs those errors using the execution logger.
 *
 * @export
 * @param {Run} run The Run object to load hooks for
 * @param {Record<string, any>} hookContext The execution context for the hooks
 * @returns {Promise<RunHook>} A Promise for the resulting RunHook object.
 */
function loadRunHooks(run, execution, additionalContext) {
    return __awaiter(this, void 0, void 0, function* () {
        run.hooks = yield run.hookFiles.reduce((hooks, path) => __awaiter(this, void 0, void 0, function* () {
            try {
                const hook = yield loadHook(path, Object.assign(Object.assign({}, execution.context), additionalContext));
                return _.assignWith(yield hooks, hook, (a, b) => a && b && _.concat(a, b) || undefined);
            }
            catch (e) {
                execution.console.error(e);
                return hooks;
            }
        }), Promise.resolve(run.hooks));
        return run;
    });
}
exports.loadRunHooks = loadRunHooks;
/**
 * Loads all the environment files for a given Run. Mutates the Run by setting run.env, then
 * returns the mutated Run.
 *
 * Note that any environment values already set in the run will be retained (unless the key
 * is overwritten by one of the loaded environments.)
 *
 * If any files cannot be loaded, this logs those errors using the execution logger.
 *
 * @export
 * @param run The run to load environments for
 * @param execution The Execution for the run
 * @param additionalContext Additional context for JS executed when loading environments
 * @returns
 */
function loadRunEnvs(run, execution, additionalContext) {
    return __awaiter(this, void 0, void 0, function* () {
        run.env = yield run.envFiles.reduce((envs, path) => __awaiter(this, void 0, void 0, function* () {
            try {
                const env = yield loadEnvironment(path, Object.assign(Object.assign({}, execution.context), additionalContext));
                return Object.assign(Object.assign({}, (yield envs)), env);
            }
            catch (e) {
                execution.console.error(e);
                return envs;
            }
        }), Promise.resolve(run.env));
        return run;
    });
}
exports.loadRunEnvs = loadRunEnvs;
/**
 * Calls all the hooks with given hookType, passing them the args provided in ...args
 *
 * If multiple hooks are specified, will be called sequentially. Hook functions are awaited.
 *
 * @export
 * @param runHook The RunHook object that contains the hooks
 * @param hookType The type of hook to execute (e.g. "preparse")
 * @param args Additional arguments to provide to the hook functions when called.
 */
function callHook(runHook, hookType, ...args) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const fn of runHook[hookType] || [])
            yield fn(...args);
    });
}
exports.callHook = callHook;
/**
 * Accepts a Run object and executes it. Mutates the run in-place.
 *
 * Note: Will only execute runs with status "pending". If you want to re-execute
 * a run that's already run, manually change status back to "pending" before
 * executing execRun. (Note: /do not/ change the status if it's "running", or
 * race conditions may ensue.)
 *
 * @export
 * @param {Run} run The Run object to execute.
 * @returns {Promise<void>} A promise that will resolve with the run. If there was errors, the promise will reject.
 */
function execRun(run, execution) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (run.status === "pending") {
                run.status = "running";
                const abortRun = () => { run.status = "pending"; return run; };
                yield loadRunEnvs(run, execution);
                yield loadRunHooks(run, execution, run.env);
                yield callHook(run.hooks, 'preparse', run, execution);
                if (getNextRun(execution) !== run)
                    return abortRun();
                const request = yield parseRequest(run.request, execution, Object.assign(Object.assign({}, run.env), { hooks: run.hooks }));
                yield callHook(run.hooks, 'postparse', run, execution);
                if (getNextRun(execution) !== run)
                    return abortRun();
                yield callHook(run.hooks, 'preexec', run, execution);
                if (getNextRun(execution) !== run)
                    return abortRun();
                const [response, error] = yield execRequest(request);
                run.status = error ? "failed" : "succeeded";
                run.response = response;
                run.error = error;
                yield callHook(run.hooks, 'postexec', run, execution);
                yield callHook(run.hooks, error ? 'error' : 'success', run, execution);
            }
            return run;
        }
        catch (e) {
            run.status = "failed";
            run.error = e;
            if (run.hooks)
                yield callHook(run.hooks, 'postexec', run, execution);
            if (run.hooks)
                yield callHook(run.hooks, 'error', run, execution);
            throw e;
        }
    });
}
exports.execRun = execRun;
/**
 * Accepts a path to a file and parses the contents of that file to generate an HTTP request.
 * Returns a Request object representing the request from the file.
 *
 * @export
 * @param {string} requestPath The path of the file to execute
 * @param {Record<string, any>} templateContext An object to use as context when EJS template-parsing.
 * @returns {Promise<Request>}
 */
function parseRequest(requestPath, execution, additionalContext) {
    return __awaiter(this, void 0, void 0, function* () {
        if (path_1.extname(requestPath) === ".http") {
            let content = yield util_1.readFile(requestPath, { encoding: 'utf8' });
            content = yield util_1.ejs(content, Object.assign(Object.assign({}, execution.context), additionalContext));
            return http_1.parseHttpRequest(content);
        }
        throw new Error(`Cannot parse request: ${requestPath}. Unknown extension ${path_1.extname(requestPath)}.`);
    });
}
exports.parseRequest = parseRequest;
/**
 * Accepts an Execution object and sequentially executes all the Runs therein.
 *
 * Note: Runs have the ability to mutate the `execution` object itself, including
 * retrying Runs or adding more Runs. Therefore, it's possible for this function to
 * enter an infinite loop. (Because this function is side-effecting and prints its own results,
 * sometimes an infinite loop is even /desirable/!)
 *
 * @export
 * @param {Execution} execution The Execution to execute
 * @returns {Promise<Execution>} A promise that resolves when the Execution has no more pending Runs
 */
function exec(execution) {
    return __awaiter(this, void 0, void 0, function* () {
        // note: Why use a while loop instead of just iterating over execution.runs?
        //       The reason is to respect any changes that user code (e.g. hooks) made to request statuses.
        //       e.g. if the request hook resets the status to "pending", we should re-execute the same request
        //       again.
        let nextRun;
        while (nextRun = getNextRun(execution)) {
            yield execRun(nextRun, execution);
            execution.console.log(runToString(nextRun, execution.config.outputMode));
        }
        return execution;
    });
}
exports.exec = exec;
/**
 * Returns a string representation for the given Run object. Supports a few output modes, configured
 * with the outputMode parameter.
 *
 * @export
 * @param {Run} run The run to print
 * @param {OutputMode} [outputMode='line'] The output mode
 * @returns {string} A string representation of the run
 */
function runToString(run, outputMode = 'line') {
    var _a, _b, _c, _d, _e;
    if (outputMode === 'json') {
        return JSON.stringify(_.omit(run, 'response.rawBody'));
    }
    const statusCode = ((_a = run.response) === null || _a === void 0 ? void 0 : _a.statusCode) || "000";
    const executionTime = (((_b = run.response) === null || _b === void 0 ? void 0 : _b.timings.end) || 0) - (((_c = run.response) === null || _c === void 0 ? void 0 : _c.timings.start) || 0);
    const responseSize = ((_d = run.response) === null || _d === void 0 ? void 0 : _d.rawBody.byteLength) || 0;
    if (outputMode === 'extended') {
        const body = ((_e = run.response) === null || _e === void 0 ? void 0 : _e.body) || "";
        const stringBody = typeof body === 'string' ? body :
            Buffer.isBuffer(body) ? body.toString('utf8') :
                typeof body === 'object' ? JSON.stringify(body) : "";
        return `${run.status}: ${run.name} ${statusCode}\n${stringBody}`;
    }
    return `${run.status} ${statusCode} ${run.name} ${responseSize} ${executionTime}`;
}
exports.runToString = runToString;
/**
 * Executes the repost CLI. Accepts a `configOverrides` object,
 * which is mostly used for testing purposes.
 *
 * @export
 * @param {*} configOverrides An object of overrides for the config passed to `cli-of-mine`.
 * @returns
 */
function cli(configOverrides) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const packageJson = require("../package.json");
            return yield cli_of_mine_1.exec(Object.assign({ name: packageJson.name, description: packageJson.description, version: packageJson.version, examples: ["repost run foo.http"], options: [
                    {
                        name: "help",
                        alias: "h",
                        type: Boolean,
                        description: "Print this usage guide",
                    },
                    {
                        name: "file",
                        defaultOption: true,
                        multiple: true,
                        type: String,
                    },
                    {
                        name: "env",
                        alias: "e",
                        type: String,
                        multiple: true,
                        description: "Specifies an environment file to use.",
                    },
                    {
                        name: "hook",
                        alias: "H",
                        type: String,
                        multiple: true,
                        description: "Specifies a hook file to use.",
                    },
                    {
                        name: "output",
                        alias: "o",
                        type: String,
                        description: "Specifies the output format to use. Supports 'line', 'json', 'extended'",
                        defaultValue: "line"
                    }
                ], handler: (ctx) => __awaiter(this, void 0, void 0, function* () {
                    const { file, env, hook, output } = ctx.args;
                    if (!file || !file.length) {
                        throw new Error("No files specified.");
                    }
                    if (!['line', 'json', 'extended'].includes(output)) {
                        throw new Error(`Invalid output format: ${output}. Pick "line", "json", or "extended"`);
                    }
                    const execution = {
                        runs: [],
                        console: ctx.console,
                        config: {
                            outputMode: output
                        },
                        context: Object.assign(Object.assign({}, util), module.exports)
                    };
                    for (const f of file)
                        addRun(execution, {
                            name: f,
                            request: f,
                            hookFiles: hook,
                            envFiles: env
                        });
                    yield exec(execution);
                }) }, configOverrides));
        }
        catch (e) {
            console.error('Error:', e);
            process.exit(1);
        }
    });
}
exports.cli = cli;
//# sourceMappingURL=index.js.map