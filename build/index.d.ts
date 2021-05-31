/// <reference types="node" />
import { Options, Response as GotResponse } from "got";
export declare type Request = Options;
export declare type Response = GotResponse;
export declare type RunStatus = "pending" | "running" | "succeeded" | "failed" | "skipped";
export interface RunHookFunction {
    (run: Run, execution: Execution): Promise<void>;
}
export declare type RunHook = Record<string, RunHookFunction[]>;
export declare type EnvironmentData = Record<string, any>;
export declare type JSExecutionContext = Record<string, any>;
export interface Run {
    status: RunStatus;
    request: string;
    response?: Response;
    error?: Error;
    name: string;
    hooks: Array<string>;
    envs: Array<string>;
}
export interface Execution {
    runs: Run[];
    console: Console;
    context: JSExecutionContext;
}
export declare type OutputMode = 'extended' | 'json' | 'line';
/**
 * Returns the next run that will be executed for a given Execution.
 *
 * Only runs with status "pending" are eligible for execution.
 *
 * @export
 * @param {Execution} execution The Execution to find a run for
 * @returns {(Run | undefined)} A run to execute if one is present -- otherwise, undefined
 */
export declare function getNextRun(execution: Execution): Run | undefined;
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
export declare function execRequest(request: Request): Promise<[Response?, Error?]>;
export declare function loadJS(filePath: string, executionContext: JSExecutionContext): Promise<unknown>;
export declare function loadEnvironment(envPath: string, executionContext: JSExecutionContext): Promise<EnvironmentData>;
export declare function loadHook(hookPath: string, executionContext: JSExecutionContext): Promise<RunHook>;
/**
 * Loads all the hooks for a given run. If multiple files specify functions for the same hook type,
 * the function lists are all concatenated together.
 *
 * If any files cannot be loaded, this logs those errors using the execution logger.
 *
 * @export
 * @param {Run} run The Run object to load hooks for
 * @param {Record<string, any>} hookContext The execution context for the hooks
 * @returns {Promise<RunHook>} A Promise for the resulting RunHook object.
 */
export declare function loadRunHooks(run: Run, execution: Execution, additionalContext?: JSExecutionContext): Promise<RunHook>;
export declare function loadRunEnvs(run: Run, execution: Execution, additionalContext?: JSExecutionContext): Promise<EnvironmentData>;
export declare function callHook(runHook: RunHook, hookType: string, ...args: Parameters<RunHookFunction>): Promise<void>;
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
export declare function execRun(run: Run, execution: Execution): Promise<Run>;
/**
 * Accepts a path to a file and parses the contents of that file to generate an HTTP request.
 * Returns a Request object representing the request from the file.
 *
 * @export
 * @param {string} requestPath The path of the file to execute
 * @param {Record<string, any>} templateContext An object to use as context when EJS template-parsing.
 * @returns {Promise<Request>}
 */
export declare function parseRequest(requestPath: string, execution: Execution, additionalContext?: JSExecutionContext): Promise<Request>;
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
export declare function exec(execution: Execution): Promise<Execution>;
/**
 * Returns a string representation for the given Run object. Supports a few output modes, configured
 * with the outputMode parameter.
 *
 * @export
 * @param {Run} run The run to print
 * @param {OutputMode} [outputMode='line'] The output mode
 * @returns {string} A string representation of the run
 */
export declare function runToString(run: Run, outputMode?: OutputMode): string;
/**
 * Executes the repost CLI. Accepts a `configOverrides` object,
 * which is mostly used for testing purposes.
 *
 * @export
 * @param {*} configOverrides An object of overrides for the config passed to `cli-of-mine`.
 * @returns
 */
export declare function cli(configOverrides: any): Promise<import("cli-of-mine/build/interfaces").ExecResult>;
//# sourceMappingURL=index.d.ts.map