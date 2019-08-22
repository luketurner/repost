# Repost

Low-friction, high-scriptability HTTP testing in the terminal. Inspired by Postman -- yet ultimately, very different.

> **WARNING:** `repost` is under heavy development and some use-cases documented in this README have not been implemented yet.

The goal of `repost` is that all workflows -- no matter how complex -- can be fully automated.

Key differences from Postman:

1. Uses plain files and directories for organizing your catalog of HTTP requests.
1. Increased Javascript scriptability: EJS templating, before/after hooks, and arbitrary JS request handlers.
1. Environments are significantly more powerful and flexible.

The `repost` package can be used as a CLI tool, or imported into your own Node scripts as a library.

> **Important:** `repost` is an experimental project, not intended for production use.

# Usage

## Installation

Install the `master` branch of `repost` from Github using `npm`.

`repost` was tested with Node v12, and may not work with earlier versions.

```
npm install -g luketurner/repost
```

(The `-g` flag is only needed if you wish to use the `repost` CLI tool.)

> **Important:** `repost` is currently distributed _without versioning_, semantic or otherwise. I can't offer any guarantees about the stability of either the CLI or the API.

## CLI Usage

`repost` is primarily intended to be run as a CLI utility. Use `repost --help` to view the usage guide. Use `repost [cmd] --help` to view help for specific commands.

```
repost

  Low-friction, automation-friendly HTTP testing in the terminal.

Examples

  repost run foo.http

Command List

  run   Execute one or more requests or collections.

Base Options

  -v, --verbose    Increase verbosity level (specify more than once to increase further)
  -h, --help       Print this usage guide
  -r, --raw        Output unformatted data for scripting
```

## Understanding Repost Terminology

- **Requests** are stored as files on disk. Requests can be declared as raw HTTP (templated with EJS), or using Javascript.
- **Collections** are directories that are identified by an empty `.repost-collection` file. Some operations can act on entire collections as a unit. Collections can be nested and include subdirectories. For example, the `/foo/bar/request.http` file is included in both the `foo` and `bar` collections.
- **Environments** are represented as `*.env.json` files. These files can declare **variables** that can be referenced and/or changed by requests. Environments can also have "computed variables", defined in `*.env.js` files.
- **Hooks** are `.js` files that can be defined alongside requests for modifying `repost` behavior and running assertions. For example, the `/foo/request.http` file would use hooks defined in `/foo/request.js`. (For raw JS requests, hooks are declared in the same file as the request.)

## Usage as a Node.js library

`repost` can also be imported into other Node.js applications to be used as a library.

The public API exposes two functions:

- `repost.newSession(config)`: Creates and returns a new `repost` session using the given configuration. Sessions provide the core API for interacting with `repost`. See [Session API](#Session_API) below.
- `repost.cli()`: Executes the CLI application using the current process cwd, argv, and stdin/stdout. Returns a promise the resolves once execution is complete.

```js
// Create a new session and use it to run a request.

const repost = require("repost");
const session = await repost.newSession();

const { err, response } = await session.run("./my-test-file.http");
```

### Session API

Repost functionality is accessed using a _session object_, like that returned by `newSession()`. The same session object is available to user-written hooks and request builders.

Session objects expose the following API:

- `session.run(...requests)`: Allows you to execute one or more requests based on filename.
- `session.envs`: Provides access to `getEnv(envFilename)` for looking up environments, and `getEnvForRequest(requestFilename)` for resolving which environment should be used for a given test.
- `session.util`: Namespace that provides a variety of utility functions, mostly for use in async hooks. Includes: `readFile` - `writeFile` - `sendHTTPRequest` - `sleep`

# Advanced Usage

## Request Types

A "request" is a file that contains a description of an HTTP request. Requests are interpreted according to their extension, as follows:

- `.http` - interpreted as an HTTP request(-ish) with EJS interpolation.
- `.js` - interpreted as a JS module that dynamically defines the request.

## EJS Interpolation

Requests are preprocessed with EJS, allowing full use of Javascript when defining them. One important usage of EJS is to inject environment variables into the tests with `<%= my_var %>`. However, more advanced usage is possible (and recommended!)

Within the EJS template, you have access to the `session` object. Additionally, all environment variables can be referenced as global variables or via the `env` object.

> **Note** `.js` requests are not pre-processed, but are executed with the same variables in scope. There is one exception -- `.js` scripts only expose environment variables within the global `env` object, not as individual global variables.

## Custom JS Requests

Requests ending in `.js` will be executed as Node modules. This allows maximum request customization, including the ability to execute non-HTTP requests using the `handler()` function.

Custom JS requests are CommonJS modules that must export (using `module.exports`) the object representing the request they want to execute. The request object will be passed more-or-less directly to Axios, so all Axios request parameters are supported.

Alternatively, the exported object can have a `handler()` method that defines arbitrary request execution. The `handler` function is executed asynchronously, and expected to return a `Promise<string>` that represents the response data to be displayed to the user.

## Hooks

`before` and `after` hooks can be defined on a per-request basis by creating another file in the same directory with the same name as the request, but replacing the extension with `.js`. For example, `./foo.http` may have hooks defined in `./foo.js`.

Hooks files should set `module.exports` to an object with `before` and/or `after` function properties. The `before` function can be used to preprocess the request, and the `after` function is called to transform the response.

```js
// foo.js (has corresponding foo.http)

module.exports = {
  async before(request) {
    // here, you can modify the request before execution
    return request;
  },
  async after(response) {
    // here, you can modify the response before displaying it
    return response;
  }
};
```

Javascript tests (those ending in `.js`) should export hooks alongside their request information:

```js
// bar.js (has no corresponding bar.http)

module.exports = {
  async before(request) {
    // ...
  },
  async after(response) {
    // ...
  },
  method: "GET",
  url: "http://localhost:8000"
};
```

## Environments

Think of enviroments as tiny key/value stores that provide shared state for your requests. They define values for variables (e.g. `base_url` or `access_token`) that can be reused across requests.

In `repost`, an environment is defined by a `*.env.json` file. For example, you can define the `base_url` variable:

```js
// default.env.json
{
  "base_url": "http://localhost:8000"
}

// referenced in requests using:
// <%= base_url %>
// or:
// <%= env.base_url %>
```

By default, requests will use the `default.env.json` environment in the same directory as them, if it exists. To specify custom environments, use the `--env` flag.

### Dynamic environment variables

In addition to `*.env.json` files, environments can have "computed properties" defined in `*.env.js` files. These files can contain arbitrary logic, and can export an environment object using `module.exports`, for example:

```js
// default.env.js

module.exports = {
  randomish_value: Math.random().toString(32).slice(2, 6);
};

// referenced in requests using:
// <%= randomish_value %>
// or:
// <%= env.randomish_value %>
```

Whatever is exported by the `*.env.js` file will be merged into the environment object prior to EJS interpolation.

For now, all environments must have a machine-readable `.env.json` file -- the `.env.js` file is not sufficient by itself. You can't have an environment with _only_ computed properties. This constraint may eventually be fixed.

---

Copyright 2019 Luke Turner - Published under the MIT License.
