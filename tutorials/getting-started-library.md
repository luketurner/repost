To use Repost as a library, you usually want to install it into your own Node project as a dependency:

```
npm i luketurner/repost
```

Because we haven't specified the `-g` flag, we will not have access to the `repost` CLI, just the library.

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

See the {@link RepostContext} interface documentation for more details.
