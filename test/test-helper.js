const util = require("../src/util");
const repost = require("../index");
const sinon = require("sinon");

const axios = require("axios");
const AxiosMockAdapter = require("axios-mock-adapter");
const mockFs = require("mock-fs");
// Mocks filesystem for tests. Expects files to be object of with filename as key and stringified content as value.
module.exports = {};

module.exports.mockFilesystem = files => {
  mockFs(files);
  return () => mockFs.restore();
};

module.exports.asyncStub = delayMs => {
  const stub = sinon.stub();
  const delayed = async () => {
    await util.sleep(delayMs);
    return stub();
  };

  return [stub, delayed];
};

module.exports.mockSession = config => {
  return repost.newSession(config);
};

module.exports.mockServer = () => {
  const mock = new AxiosMockAdapter(axios);
  return mock;
};

module.exports.buildHTTPRequest = ({ path }) =>
  `GET http://localhost:8000${path} HTTP/1.1
Content-Type: asdf
Origin: localhost

this is a body...`;
