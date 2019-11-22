For all request formats, Repost performs EJS interpolation on the request before parsing it. This allows users to embed arbitrary JS directly into their request files.

> **Note:** The exception is custom JS requests, which are not interpolated.

The following line injects the value of the `foo` variable into the request:

```
<%= foo %>
```

> See [EJS docs](https://ejs.co/#docs) for a more detailed EJS usage guide.

EJS templates are executed within a {@link RepostContext}. All the properties of the {@link RepostContext} are available as global variables. For example:

```js
<% log.info("logging!") %>
```

EJS templates are executed asynchronously, so the `await` keyword can be used within your EJS code. For example:

```js
<%= (await request.run("bar.http")).data.token %>
```
