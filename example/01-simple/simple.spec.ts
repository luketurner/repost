import { cli } from "../../src";

describe("example/simple", () => {
  beforeAll(async () => {
    process.chdir(__dirname);
  });

  it("should return success message", async () => {
    const res = await cli({
      argv: ["request.http"],
      stdout: "capture",
      errorStrategy: "throw"
    });
    expect(res.stdout).toMatch("Success!");
  });
});
