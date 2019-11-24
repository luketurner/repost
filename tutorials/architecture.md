This page describes Repost's internal architecture. This information is intended for programmers who want to learn about the Repost codebase.

# Overview

The Repost codebase aims to achieve the following invariants:

- No global state usage. A script should be able to use multiple RepostContexts independently.
- The same API can be used in user scripts as well as library consumers.
- All user scripts support async code.
- All output (e.g. logging) can be captured and configured.
- No usage of JS prototypes or the `this` or `new` keywords (except to instantiate classes from dependencies.)
- Coherently documentable with JSDoc
- Promises (and `async`/`await`) are preferred form of asynchronous control flow.

WIP!
