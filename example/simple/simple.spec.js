const path = require("path");

const { cli } = require("../..");

describe("example/simple", () => {
  beforeAll(async () => {
    process.chdir(__dirname);
  });

  it("should return success message", async () => {
    const res = await cli({
      argv: ["run", "request.http"],
      stdout: "capture",
      errorStrategy: "throw"
    });
    expect(res.stdout).toMatch("Success!");
  });
});
