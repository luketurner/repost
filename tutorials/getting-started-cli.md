This tutorial will walk you through getting started with using the Repost CLI tool.

# Installation

To use `repost` on the CLI, it must be added to your PATH. If you install with the `-g` flag, it will be added to your PATH automatically:

```
npm install -g luketurner/repost
```

> **Note:** Repost is not distributed via NPM and is not semantically versioned (yet). The above command will download the latest version from Github `master` branch.

Now you can run `repost`:

```
repost --help
```

# Making a Request

The core purpose of the Repost CLI is to execute **HTTP requests**, which are represented as files on disk. The file extension indicates how the request is formatted.

For example, if the file ends in `.http`, it's assumed to contain a raw HTTP request (as described in [rfc2616](https://www.w3.org/Protocols/rfc2616/rfc2616-sec5.html)).

> (Aside: `.http` files are not _completely_ raw. EJS interpolation is performed on them, and some headers are automatically added. See {@tutorial http-request-format} for more information about this request format.)

To demonstrate, we can scaffold a `.http` request file with `repost create`:

```bash
repost create request foo.http
```

This has created a `./foo.http` file. The contents look something like this:

```
{{ method }} {{ url }} HTTP/1.1
{{ header-key }}: {{ header-value }}

{{ body }}
```

The `{{ ... }}` blocks are placed there by the scaffold to demonstrate the structure of the file. They can be replaced with our own content. Let's put in one of the example requests (from the `/example/simple` directory). Once we filled in our details, `./foo.http` looks like this:

```
GET http://localhost:8000/test HTTP/1.1
Content-Type: text/plain
Origin: localhost

this is a body
```

To execute this request with Repost, we can use the `repost run` command. It accepts any number of files and/or directories, which are scanned and executed in parallel.

In this case, we just have one request. Let's try to run it:

```bash
> repost run foo.http

--- foo.http ---
Error: connect ECONNREFUSED 127.0.0.1:8000
```

Uh oh!

Our request is trying to connect to `http://localhost:8000/test` -- but because we don't have a webserver listening on port `8000`, the request didn't succeed.

Let's fix that by starting the webserver we want to test. In this case, assume we've created a simple `my_express_server.js` file:

```js
// my_express_server.js
// usage: node my_express_server.js

const app = require("express")();

app.get("/test", (req, res) => {
  res.send("Success!");
});

app.listen(8000, () => console.log("Listening on port 8000"));
```

We can start this server with:

```
npm install express
node my_expres_server.js
```

Once we've started our webserver, we can run our request with more success:

```
> repost run foo.http

--- foo.http ---
GET http://localhost:8000/test
x-powered-by: Express
content-type: text/html; charset=utf-8
content-length: 8
etag: W/"8-fOAfY4FGM2LPau8vhDpZJh6PVYc"
date: Sun, 24 Nov 2019 02:11:57 GMT
connection: close

Success!
```

Great! Our request was able to get to our server and it returned the expected response.

# Next Steps

So far, nothing we've done is beyond a simple `curl` -- but where `repost` really excels is **workflow automation**.

Pretty much any HTTP testing workflow, no matter how complex, can be "boiled down" to a single `repost run` command.

The core automation tools you'll want to be familiar with are _environments_, _hooks_, _collections_, and _EJS interpolation_.

- {@tutorial environments} are `.env.json` files that let you share persistent variables across requests.
- {@tutorial hooks} are `.js` files that let you define `before` and `after` handlers for your HTTP requests.
- {@tutorial collections} are directories filled with requests that can be executed "as a unit."
- {@tutorial ejs-interpolation} describes the syntax for using embedded JS in your `.http` request files.

For "worked examples" of common workflow automations, check the `example` directory of the source code (also [available on Github](https://github.com/luketurner/repost/tree/master/example)).
