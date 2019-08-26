const expect = require("chai").expect;
const sinon = require("sinon");
require("chai").use(require("sinon-chai"));
const makeEnv = require("../../src/envs");
const util = require("../../src/util");

const { mockFilesystem, mockSession } = require("../test-helper");

describe("module: envs", () => {
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

  describe("getEnv", () => {
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

  describe("patchEnv", () => {
    const expectPatchedWith = async (env, patch, expected) => {
      const returned = await makeEnv(mockSession()).patchEnv(env, patch);
      expect(returned).to.eql(expected);
      expect(JSON.parse(await util.readFile(env, "utf8"))).to.eql(expected);
    };

    it("should add properties from patch object into the environment", async () => {
      await expectPatchedWith(
        "jsonenv.env.json",
        { patch: "yes" },
        { hi: "there", patch: "yes" }
      );
    });

    it("should add properties from patch object into the environment (JSON + js)", async () => {
      await expectPatchedWith(
        "bothenv.env.json",
        { patch: "yes" },
        { hi: "both", patch: "yes" }
      );
    });

    it("should overwrite properties from environment with patch object", async () => {
      await expectPatchedWith(
        "jsonenv.env.json",
        { patch: "yes", hi: "again" },
        { hi: "again", patch: "yes" }
      );
    });

    it("should create a new environment if it doesn't already exist", async () => {
      await expectPatchedWith(
        "new.env.json",
        { patch: "yes" },
        { patch: "yes" }
      );
    });
  });
});
