const path = require("path");

const { cli, createContext } = require("../..");

describe("example/authentication", () => {
  beforeAll(async () => {
    process.chdir(__dirname);
  });

  it("should return success message", async () => {
    const testContext = await createContext({
      env: "default.env.json"
    });

    testContext.envs.write = jest.fn();
    const res = await cli(["run", "request.http"], {
      captureOutput: true,
      context: testContext
    });
    expect(res.stdout).toMatch("get_access_token: test_token");
    expect(res.stdout).toMatch("Success!");
    expect(testContext.envs.write).toHaveBeenCalledWith("default.env.json", {
      base_url: "http://localhost:8000",
      api_key: "test_key",
      access_token: "test_token"
    });
  });
});
