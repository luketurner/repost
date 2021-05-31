import * as _ from "lodash";

import got, {
  Options,
  Response as GotResponse,
} from "got";
import { exec as cliExec } from "cli-of-mine";
import { extname } from "path";
import { readFile, ejs } from "./util";
import { parseHttpRequest } from "./http";
import { compileFunction, createContext } from "vm";

export type Request = Options;
export type Response = GotResponse;

export type RunStatus =
  | "pending"
  | "running"
  | "succeeded"
  | "failed"
  | "skipped";

export interface RunHookFunction { (run: Run, execution: Execution): Promise<void> }

export type RunHook = Record<string, RunHookFunction[]>;

export type EnvironmentData = Record<string, any>;
export type JSExecutionContext = Record<string, any>;

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

export type OutputMode = 'extended' | 'json' | 'line';

/**
 * Returns the next run that will be executed for a given Execution.
 * 
 * Only runs with status "pending" are eligible for execution.
 *
 * @export
 * @param {Execution} execution The Execution to find a run for
 * @returns {(Run | undefined)} A run to execute if one is present -- otherwise, undefined
 */
export function getNextRun(execution: Execution): Run | undefined {
  return execution.runs.find((r) => r.status === "pending");
}


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
export async function execRequest(
  request: Request,
): Promise<[Response?, Error?]> {
  let response: Response | undefined;
  try {
    response = await got<any>(request as any);
    return [response, undefined];
  } catch (e) {
    if (e.response) response = e.response;
    return [response, e];
  }
}

export async function loadJS(filePath: string, executionContext: JSExecutionContext): Promise<unknown> {
  const content = await readFile(filePath, { encoding: 'utf8' });
  return await compileFunction(content, [], {
    parsingContext: createContext(executionContext)
  })();
}

export async function loadEnvironment(envPath: string, executionContext: JSExecutionContext): Promise<EnvironmentData> {
  // TODO -- validate
  const env = await loadJS(envPath, executionContext);
  if (typeof env !== 'object' || env === null) throw new Error(`Invalid environment file: ${envPath}. Must export a JS object.`);
  return env as EnvironmentData;

}

export async function loadHook(hookPath: string, executionContext: JSExecutionContext): Promise<RunHook> {
  const hook = await loadJS(hookPath, executionContext) as Record<string, any>;
  if (typeof hook !== 'object' || hook === null) throw new Error(`Invalid hook file: ${hookPath}. Must export a JS object.`);
  for (const [k, v] of Object.keys(hook)) {
    if (!Array.isArray(v)) { hook[k] = [v]; } // convert single functions into arrays
    for (const f of hook[k]) {
      if (typeof f !== 'function') throw new Error(`Invalid hook file: ${hookPath}. Hooks must be functions.`);
    }
  }
  return hook;
}

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
export async function loadRunHooks(run: Run, execution: Execution, additionalContext?: JSExecutionContext): Promise<RunHook> {
  return await run.hooks.reduce(async (hooks, path) => {
    try {
      const hook = await loadHook(path, {...execution.context, ...additionalContext});
      return _.mergeWith(await hooks, hook, _.concat);
    } catch (e) {
      execution.console.error(e);
      return hooks;
    }
  }, Promise.resolve({} as RunHook));
}

export async function loadRunEnvs(run: Run, execution: Execution, additionalContext?: JSExecutionContext): Promise<EnvironmentData> {
  return await run.envs.reduce(async (envs, path) => {
    try {
      const env = await loadEnvironment(path, {...execution.context, ...additionalContext});
      return { ...(await envs), ...env }
    } catch (e) {
      execution.console.error(e);
      return envs;
    }
  }, Promise.resolve({} as EnvironmentData));
}

export async function callHook(runHook: RunHook, hookType: string, ...args: Parameters<RunHookFunction>) {
  for (const fn of runHook[hookType] || []) await fn(...args);
}

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
export async function execRun(run: Run, execution: Execution): Promise<Run> {
  let environmentData: EnvironmentData = {};
  let hooks: RunHook = {};
  try {
    if (run.status === "pending") {
      run.status = "running";

      environmentData = await loadRunEnvs(run, execution);
      hooks = await loadRunHooks(run, execution, environmentData);

      callHook(hooks, 'preparse', run, execution);
      const request = await parseRequest(run.request, execution, { ...environmentData, hooks });
      callHook(hooks, 'postparse', run, execution);

      callHook(hooks, 'preexec', run, execution);

      const [response, error] = await execRequest(request);
      run.status = error ? "failed" : "succeeded";
      run.response = response;
      run.error = error;

      callHook(hooks, 'postexec', run, execution);
      callHook(hooks, error ? 'error' : 'success', run, execution);
    }
    return run;
  } catch (e) {
    run.status = "failed";
    run.error = e;
    if (hooks) callHook(hooks, 'postexec', run, execution);
    if (hooks) callHook(hooks, 'error', run, execution);
    throw e;
  }
}

/**
 * Accepts a path to a file and parses the contents of that file to generate an HTTP request.
 * Returns a Request object representing the request from the file.
 *
 * @export
 * @param {string} requestPath The path of the file to execute
 * @param {Record<string, any>} templateContext An object to use as context when EJS template-parsing.
 * @returns {Promise<Request>}
 */
export async function parseRequest(requestPath: string, execution: Execution, additionalContext?: JSExecutionContext): Promise<Request> {
  if (extname(requestPath) === ".http") {
    let content = await readFile(requestPath, { encoding: 'utf8' });
    content = await ejs(content, { ...execution.context, ...additionalContext });
    return parseHttpRequest(content);
  }

  throw new Error(`Cannot parse request: ${requestPath}. Unknown extension ${extname(requestPath)}.`)
}

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
export async function exec(execution: Execution): Promise<Execution> {
  
  // note: Why use a while loop instead of just iterating over execution.runs?
  //       The reason is to respect any changes that user code (e.g. hooks) made to request statuses.
  //       e.g. if the request hook resets the status to "pending", we should re-execute the same request
  //       again.
  let nextRun: Run | undefined;
  while (nextRun = getNextRun(execution)) {
    await execRun(nextRun!, execution);
    execution.console.log(runToString(nextRun!));
  }
  return execution;
}

/**
 * Returns a string representation for the given Run object. Supports a few output modes, configured
 * with the outputMode parameter.
 *
 * @export
 * @param {Run} run The run to print
 * @param {OutputMode} [outputMode='line'] The output mode
 * @returns {string} A string representation of the run
 */
export function runToString(run: Run, outputMode: OutputMode = 'line'): string {
  if (outputMode === 'json') {
    return JSON.stringify(run);
  }

  const statusCode = run.response?.statusCode || "000";
  const executionTime = (run.response?.timings.end || 0) - (run.response?.timings.start || 0);
  const responseSize = run.response?.rawBody.byteLength || 0;
  
  if (outputMode === 'extended') {
    const body = run.response?.body || "";
    const stringBody: string =
      typeof body === 'string' ? body :
      Buffer.isBuffer(body)    ? body.toString('utf8') :
      typeof body === 'object' ? JSON.stringify(body) : "";
    return `${run.status}: ${run.name} ${statusCode}\n${stringBody}`;
  }

  return `${run.status} ${statusCode} ${run.name} ${responseSize} ${executionTime}`;
}

/**
 * Executes the repost CLI. Accepts a `configOverrides` object,
 * which is mostly used for testing purposes.
 *
 * @export
 * @param {*} configOverrides An object of overrides for the config passed to `cli-of-mine`.
 * @returns
 */
export async function cli(configOverrides: any) {
  try {
    const packageJson = require("../package.json");
    return await cliExec({
      name: packageJson.name,
      description: packageJson.description,
      version: packageJson.version,
      examples: ["repost run foo.http"],
      options: [
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

      ],
      handler: async (ctx) => {
        const { file, env, hook } = ctx.args;
        if (!file || !file.length) {
          throw new Error("No files specified.");
        }

        const execution = {
          runs: file.map((f: string) => ({
            status: "pending",
            name: f,
            request: f,
            hooks: hook || [],
            envs: env || []
          })),
          console: ctx.console,
          context: {
            // TODO -- populate execution context for JS stuff here
          }
        };

        await exec(execution);
      },
      ...configOverrides,
    });
  } catch (e) {
    console.error('Error:', e);
    process.exit(1);
  }
}