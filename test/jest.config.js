const path = require("path");
module.exports = {
  globalSetup: path.join(__dirname, "setup.js"),
  globalTeardown: path.join(__dirname, "teardown.js"),
  rootDir: ".."
};
