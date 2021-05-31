# Repost

Low-friction, scriptable HTTP testing in the terminal. Inspired by Postman -- yet ultimately, very different.

- Save commonly-used HTTP requests as `.http` files and run them with: `repost foo.http`
- Store shared variables in an environment file and reference them in your requests.
- Create a hook file to augment the request execution with custom JS code.

> **Warning:** Repost is an experimental tool not intended for production usage. Use at your own risk.
> 
> In particular, **do not** execute untrusted requests, hooks or environments, as these can (by design)
> run arbitrary JS code on your computer.

```bash
# install repost CLI from Github
npm i -g luketurner/repost

echo "GET https://luketurner.org HTTP/1.1\n" > example.http

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

Requests may contain embedded Javascript code that will be executed at runtime by the [ejs](https://ejs.co/) templating engine. For example, you can use a `<%= ... %>` tag to inject a Javascript expression into your request:

```
POST https://example.com/foobar HTTP/1.1
Content-Type: text/plain

One plus one is <%= 1 + 1 %>!
```

See [ejs docs](https://ejs.co/#docs) for a list of all the tags you can use in your templates.


Embedded JS has access to all the variables and functions present in the Environment(s) that are configured.

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
```

---

Copyright 2019 Luke Turner - Published under the MIT License.
