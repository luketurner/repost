Files ending with `.http` are interpreted as "raw" HTTP requests, according to the [RFC2616](https://www.w3.org/Protocols/rfc2616/rfc2616-sec5.html) format specification. For example:

```
GET http://localhost:8000/test HTTP/1.1
Content-Type: asdf
Origin: localhost

this is a body!
```

Prior to being parsed, HTTP requests undergo EJS interpolation (see {@tutorial ejs-interpolation}). This can be used, for example, to populate the base URL from an environment (see {@tutorial environments}):

```
GET <%= env.base_url %>/test HTTP/1.1
Content-Type: asdf
Origin: localhost

this is a body!
```

Note that although they are raw requests, these files are not pushed over the wire directly -- they are parsed and converted into a Request object for transformation, which is later converted back into a raw request to be sent over the wire.

## Editor Support

If you are using VS Code, the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension offers syntax highlighting for HTTP requests, plus in-editor support for executing them.

However, it uses a different structure for environment variables which is incompatible with `repost`, so only simple requests can be shared by both clients.
