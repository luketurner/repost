# Repost

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
  - Use of subcommands with verb-noun format (`create request`, `create env`, etc.)
  - Better documentation of default arguments
  - Robust response printing for custom response handlers
  - More configuration options exposed via CLI
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
