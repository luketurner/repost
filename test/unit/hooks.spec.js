const expect = require("chai").expect;
const sinon = require("sinon");
require("chai").use(require("sinon-chai"));
const makeHooks = require("../../src/hooks");

const { mockFilesystem, mockSession } = require("../test-helper");

describe("module: hooks", () => {
  describe("getRequestHooks", () => {
    let restoreFs;
    let files;

    beforeEach(() => {
      files = {
        "request.http": "GET http://localhost/hi",
        "request.js": `module.exports = {
          before: (v) => ({ beforeHooked: true, ...v }),
          after: (v) => ({ afterHooked: true, ...v }),
        }`
      };

      restoreFs = mockFilesystem(files);
    });

    afterEach(() => {
      restoreFs();
    });

    it("should retrieve hook data if present", async () => {
      const hooks = makeHooks(mockSession());
      const actual = await hooks.getTestHooks("request.http");
      expect(actual.before({})).to.eql({ beforeHooked: true });
      expect(actual.after({})).to.eql({ afterHooked: true });
    });

    it("should return identity hooks if hooks are not specified", async () => {
      const hooks = makeHooks(mockSession());
      const actual = await hooks.getTestHooks("requestasdf.http");
      expect(actual.before({})).to.eql({});
      expect(actual.after({})).to.eql({});
    });
  });
});
