module.exports = {
  roots: ["<rootDir>/src", "<rootDir>/test", "<rootDir>/example"],
  globalSetup: "<rootDir>/test/setup.js",
  globalTeardown: "<rootDir>/test/teardown.js",
  // globalSetup: path.joinPath(__dirname, "setup.js"),
  // globalTeardown: path.joinPath(__dirname, "teardown.js"),
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  }
};
