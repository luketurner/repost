const expect = require("chai").expect;
const sinon = require("sinon");
require("chai").use(require("sinon-chai"));
const parse = require("../../../../src/request/js/parse");

describe("module: request-parser/js", () => {
  describe("parse()", () => {
    it("should execute the javascript and return module.exports", async () => {
      expect(await parse("module.exports = {foo: 'bar'};\n")).to.eql({
        foo: "bar"
      });
    });

    it("should allow returning async functions", async () => {
      const result = await parse(
        "module.exports = { async foo() { return await 'bar'; } };\n"
      );
      expect(await result.foo()).to.eql("bar");
    });
  });
});
