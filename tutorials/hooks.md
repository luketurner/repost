`before` and `after` hooks can be defined on a per-request basis by creating another file in the same directory with the same name as the request, but replacing the extension with `.js`. For example, `./foo.http` may have hooks defined in `./foo.js`.

Hooks files are expected to be CommonJS modules that export `before` and/or `after` function properties. The `before` function can be used to preprocess the request, and the `after` function is called to transform the response.

For example:

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

Hook files can also export an (optionally async) function that returns the hooks object:

```js
// foo.js (has corresponding foo.http)

module.exports = async () => ({
  async before(request) {
    // here, you can modify the request before execution
    return request;
  },
  async after(response) {
    // here, you can modify the response before displaying it
    return response;
  }
});
```

Custom JS tests (those ending in `.js`) should export hooks alongside their request information:

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
