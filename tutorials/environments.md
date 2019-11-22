Environments are tiny key/value stores that can hold user-defined variables (e.g. `base_url` or `access_token`) that can be reused across requests.

Environments can be used for:

1. Sharing a single value across multiple requests. (e.g. all of your endpoints have the same `base_url`)
2. Providing a persistent store for data when executing {@tutorial hooks} or custom requests. (e.g. having an `access_token` that gets set automatically by a hook.)

An environment is defined by a `*.env.json` file, which may optionally have an associated `*.env.js` file that defines computed variables.

For example, you can define the `base_url` variable:

```js
// default.env.json
{
  "base_url": "http://localhost:8000"
}

// referenced in requests using:
// <%= env.base_url %>
```

By default, the `repost` CLI uses the `./default.env.json` environment, if it exists. Otherwise, a temporary environment with no variables is used (and is not persisted to disk). This behavior can be overridden with the `-e/--env` command-line flag.

## Using Variables

The current environment's variables are available in all user code (hooks, EJS, etc.) in the global `env` object. As a user of the Repost API, you can access them at {#link RepostContext#env}.

The properties of the `env` object can also be modified by user code. Any changes to the `env` object are automatically persisted back to the `.env.json` file.

## Computed variables

In addition to `*.env.json` files, environments can have "computed variables" defined in `*.env.js` files.

> **Note:** For now, all environments must have a machine-readable `.env.json` file -- the `.env.js` file is not sufficient by itself. You can't have an environment with _only_ computed properties. This constraint may eventually be fixed.

`*.env.js` files are expected to be CommonJS modules that export an object which contains the computed properties. They can contain arbitrary logic. For example:

```js
// default.env.js

module.exports = {
  randomish_value: Math.random().toString(32).slice(2, 6);
};

// referenced in requests using:
// <%= env.randomish_value %>
```

Whatever is exported by the `*.env.js` file will be merged into the environment object. Non-computed properties are higher priority, and will shadow computed properties of the same name.

The `*.env.js` file can choose to export a function (which can optionally be async), instead of exporting the values directly. For example:

```js
// default.env.js

module.exports = async () => ({
  randomish_value: Math.random().toString(32).slice(2, 6);
});
```
