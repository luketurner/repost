import { cli } from "../../src";

describe("example/multitest", () => {
  beforeAll(async () => {
    process.chdir(__dirname);
  });

  it("should return success message", async () => {
    const res = await cli({
      argv: ["run", "foobarbaz.js"],
      stdout: "capture",
      errorStrategy: "throw"
    });
    expect(res.stdout).toMatch("Done!");
  });
});
