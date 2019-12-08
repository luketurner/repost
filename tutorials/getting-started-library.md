# Installation

To use Repost as a library, you usually want to install it into your own Node project as a dependency:

```
npm i luketurner/repost
```

Because we haven't specified the `-g` flag, we will not have access to the `repost` CLI, just the library.

# Making a request

Most usage of the Repost library revolves around the {@link RepostContext} object. You almost always want to start by creating a new context, which we can do with {@link module:repost~createContext}:

```js
const { createContext } = require("repost");

const ctx = createContext();
```

Now, our `ctx` can be used to run requests programmatically:

```js
const response = await ctx.run("my-request.http");
```

The important thing to understand about {@link RepostContext} is that it's used as the _global context object_ for all user scripts evaluated in the process of running a command. All properties of the context object will be globally available in user scripts (like {@tutorial hooks}).

# Appendix: Running the CLI programmatically

The Repost CLI application can be launched with the {@link module:repost.cli} function:

```js
const { cli } = require("repost");

cli();
```

By default, the `cli` method will use the process's `argv` and I/O streams. It returns a Promise that resolves when the CLI execution is completely finished.

If a script wishes to fully control the CLI's I/O, it can do so by passing an options argument to the `cli()` function. To have the output data returned as a string instead of written to STDOUT/STDERR, for example, you can do so by setting `stdout` and `stderr` to `"capture"`:

```js
const { cli } = require("repost");

const { stdout } = await cli({
  stdout: "capture"
});

assert(typeof stdout === "string");
```

Then, your application can log `stdout` using whatever medium you like. (You can also pass a WriteableStream of your choosing as the `stdout` option instead of using `"capture"`, in which case no data will be returned.)

A full example that encapsulates all I/O (e.g. for testing purposes) would look like:

```js
const { cli } = require("repost");

const { result, stdout, stderr } = await cli({
  argv: ["repost", "run", "my-request.http"],
  stdin: "Fake STDIN data",
  stdout: "capture",
  stderr: "capture"
});

assert(result === undefined);
assert(typeof stdout === "string");
assert(typeof stderr === "string");
```
