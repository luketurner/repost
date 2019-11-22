Request files ending with `.js` are assumed to contain a CommonJS module that exports a {@link Request} object, or a function returning a {@link Request} object.

A very simple JS request looks like:

```js
// my_request.js
module.exports = {
  url: "http://foo.com",
  method: "GET"
};
```

Or using the function-style, a trivial example:

```js
// my_fn_request.js
module.exports = () => {
  const url = "http://foo.com";
  const method = "GET";
  return { url, method };
};
```

Note that the exported function can be `async` if you want, in which case it will be automatically awaited.

```js
// my_async_request.js
module.exports = async () => {
  const url = "http://foo.com";
  const method = "GET";
  return { url, method };
};
```

Furthermore, it's possible to completely customize the behavior of the request by placing an optional `handler` property on the exported {@link Request}. The handler can be async.

```js
// my_weird_request.js
module.exports = {
  async handler(request) {
    return {
      data: "Foo!"
    };
  }
};
```

When `handler` is set, it will be called with request during execution, and the return value (or the resolved value of a returned Promise) will be used as the response.

The default `handler` for all request types is {@link util.sendHTTPRequest}. The custom JS request type is the only one that allows you to override this default.
