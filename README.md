# Repost

Low-friction, scriptable HTTP testing in the terminal. Inspired by Postman -- yet ultimately, very different.

- Save commonly-used HTTP requests as `.http` files and run them with: `repost foo.http`
- Store shared variables in an environment file and reference them in your requests.
- Create a hook file to augment the request execution with custom JS code.

```bash
# install repost CLI from Github
npm i -g luketurner/repost

echo "GET https://luketurner.org HTTP/1.1\n\n" > example.http

repost example.http
```

# Usage Guide

**Basic Usage:** `repost FILE`

When called with this form, `repost` will execute the HTTP request contained in the specified `FILE`.

Multiple files can be specified, in which case the requests will be executed sequentially in the specified order.

The file(s) **must** have a `.http` extension to be executed. Files with unknown extensions will be included in the list of results as a failure.

The content of the file(s) should be an HTTP request to execute, including:

1. (required) Status line
2. (optional) Headers
3. (optional) Body

The headers and the body must be separated by an empty line, as in a true HTTP request:

```
POST https://example.com/foobar HTTP/1.1
Content-Type: text/plain

Hello, world!
```

> **Note on parsing HTTP requests**
>
> Within `repost`, HTTP requests are not read directly from the file over the network. They're first parsed into a Javascript data structure, so Hooks can programmatically alter the contents of requests prior to execution.
>
> To convert the HTTP requests to JS, I wrote a naive parser. It works for simple requests, but is far from a true, compliant HTTP parser.
>
> This means some HTTP features (e.g. Multipart, non-utf8 encodings) are not supported. Caveat emptor!

## Output format

By default, the `repost` CLI outputs results using a concise, line-oriented format.

For each request that's run, a line is printed with the following information about the response:

```
runStatus httpStatusCode filename responseSize responseDuration
```

e.g.

```
> repost example.http
succeeded 200 example.http 345 72
```

This format is intended to work well with shell pipelining. For example, to execute all requests and only see the ones that failed, run:

```bash
repost *.http | grep ^failed
```

## Embedded Javascript

Requests may contain embedded Javascript code that will be executed at runtime by the [ejs](https://ejs.co/) templating engine.

Embedded JS has access to all the same variables and functions that Hooks do.

For example, you can use a `<%= ... %>` tag to inject a Javascript expression into your request:

```
POST https://example.com/foobar HTTP/1.1
Content-Type: text/plain

One plus one is <%= 1 + 1 %>!
```

See [ejs docs](https://ejs.co/#docs) for a list of all the tags you can use in your templates.

## 1. Running Requests

Repost is designed to send HTTP requests and display the response from the server. In particular, it's great when you need to run the same request over and over again (e.g. for testing your API.)

As a simple example, suppose your API exposes a `/options` endpoint. You want to test this request locally and make sure you get the correct response.

1.

> **Github Reader Note:** This README includes links to other parts of the Repost documentation. These links won't work when viewing the README in Github -- check out the [hosted docs](https://luketurner.org/repost).

> **WARNING:** `repost` is an experimental project, not intended for production use. Use at your own risk!

Low-friction, high-scriptability HTTP testing in the terminal. Inspired by Postman -- yet ultimately, very different.

The goal of `repost` is that all workflows -- no matter how complex -- can be fully automated.

Key differences from Postman:

1. Uses plain files and directories for organizing your catalog of HTTP requests.
1. Increased Javascript scriptability: EJS templating, before/after hooks, and arbitrary JS request handlers.
1. Environments are significantly more powerful and flexible.

The `repost` package can be used as a CLI tool, or imported into your own Node scripts as a library.

# Short Usage Guide

```bash
# Node v12+ required
npm install -g luketurner/repost

repost --help
```

For more information, consult {@tutorial getting-started-cli} or {@tutorial getting-started-library}

# Development

This section is for those trying to make changes to Repost itself.

For starters, you need to clone the Git directory:

```bash
git clone https://github.com/luketurner/repost.git
```

Then install npm dependencies:

```bash
npm i
```

Repost exposes its development commands as `npm` scripts. The following scripts are available:

```bash
npm run cli         # runs the repost CLI
npm run debug       # Runs the repost CLI with --inspect-brk

npm run test        # Runs the repost test suite

npm run docs        # Builds the docs
npm run docs:serve  # Builds the docs and serves on localhost:8080
npm run docs:watch  # like docs:serve, but automatically rebuilds on file changes
```

# TODOs

The following things should be complete before `repost` is considered "release ready:"

- Improved collection support
  - getRequests should include all requests in subdirectories
  - `repost run` should accept non-collection directories that may contain collections
- Environment resolution should look in parent directories, look relative to request paths, and find any environment, but prefer default ones
- Environment writing should resolve possible race conditions
- Hooks for custom JS requests should execute only once
- Add collection and hook examples
- CLI interface improvements
  - Codify exit codes
  - Better documentation of default arguments
  - Robust response printing for custom response handlers
  - More configuration options exposed via CLI
  - Accept requests from stdin
- JSDoc improvements
  - Complete Getting Started for CLI
  - Complete Getting Started for Library
  - Document collections
  - Document architecture
  - Integrate example directory into documentation
  - Add more links
  - Find way to document non-class object more effectively?
  - Fully documented Request and Response formats

The following larger features are also "on the roadmap":

- API support for more than one request per file
  - Use of `?` syntax to query sub-requests on command line
- Support for OpenAPI (swagger) formatted requests
- Support for multiple formats having the same extension, able to disambiguate based on content
- Support for Postman collections
- Able to run as a "mock server" for some request types instead of acting as a "mock client"
- Built-in APIs for common but complicated workflows, like OAuth token herding.

---

Copyright 2019 Luke Turner - Published under the MIT License.
