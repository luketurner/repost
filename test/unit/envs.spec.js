const expect = require("chai").expect;
const sinon = require("sinon");
require("chai").use(require("sinon-chai"));
const makeEnv = require("../../src/envs");

const { mockFilesystem, mockSession } = require("../test-helper");

describe("module: envs", () => {
  describe("getEnv", () => {
    let restoreFs;
    let files;

    beforeEach(() => {
      files = {
        "jsonenv.env.json": '{"hi": "there"}',
        "jsenv.env.js": 'module.exports = { mykey: "data" }',
        "bothenv.env.json": '{"hi": "both"}',
        "bothenv.env.js": 'module.exports = { hello: "there" }'
      };

      restoreFs = mockFilesystem(files);
    });

    afterEach(() => {
      restoreFs();
    });

    it("should retrieve JSON environment data if present", async () => {
      const envs = makeEnv(mockSession());
      expect(await envs.getEnv("jsonenv.env.json")).to.eql({ hi: "there" });
    });

    it("should retrieve JS environment data if present", async () => {
      const envs = makeEnv(mockSession());
      expect(await envs.getEnv("jsenv.env.json")).to.eql({ mykey: "data" });
    });

    it("should retrieve and merge both JSON and JS data if present", async () => {
      const envs = makeEnv(mockSession());
      expect(await envs.getEnv("bothenv.env.json")).to.eql({
        hi: "both",
        hello: "there"
      });
    });

    it("should return an empty object if no environment data is present", async () => {
      const envs = makeEnv(mockSession());
      expect(await envs.getEnv("noenv.env.json")).to.eql({});
    });
  });
});
