#!/usr/bin/env node

const repost = require("../");

repost.cli({
  errorStrategy: "exit"
});
