# Authentication Example

You can use `repost` to automatically authenticate you with the server prior to executing requests. This can be performed conditionally (e.g. only request a new token if you don't already have a valid one).

This example uses `repost` Environments to achieve the desired logic, as follows:

- The `default.env.json` environment file contains the credentials needed to acquire a new access token, as well as the preexisting access token, if any.
- The `default.env.js` file (which is executed whenever the environment is loaded) defines a `get_access_token` function.
  - The `get_access_token` function checks the local environment data, returns an existing access token if known.
  - If no local access token is found, the function uses `await session.run("auth.http")` to execuute the auth request.
  - The updated access token is written back into the environment.
- Requests can use `<%= await get_access_token() %>` to embed the access token into their contents. (`await` is required since `get_access_token` is declared as async in `default.env.js`.)

## Usage

```
cd example/authentication

repost run request.http
```
