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

---

Copyright 2019 Luke Turner - Published under the MIT License.
