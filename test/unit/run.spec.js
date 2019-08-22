const expect = require("chai").expect;
const sinon = require("sinon");
require("chai").use(require("sinon-chai"));
const makeRun = require("../../src/run");

const {
  mockFilesystem,
  mockSession,
  mockServer,
  buildHTTPRequest
} = require("../test-helper");

describe("module: run", () => {
  describe("run()", () => {
    let restoreFs;
    let files;
    let server;

    beforeEach(() => {
      files = {
        "request.http": buildHTTPRequest({ path: "/test" }),
        "request2.http": buildHTTPRequest({ path: "/test_two" }),
        "request.js": `module.exports = {
          before: (v) => ({ beforeHooked: true, ...v }),
          after: (v) => ({ afterHooked: true, ...v }),
        }`,
        testcollection: {
          ".repost-collection": "",
          "req1.http": buildHTTPRequest({ path: "/test" }),
          "req2.http": buildHTTPRequest({ path: "/test_two" })
        },
        testcoll_env: {
          ".repost-collection": "",
          "req1env.http": buildHTTPRequest({ path: "/test" }),
          "default.env.js": "module.exports = {}",
          "default.env.json": "{}"
        },
        testcoll_other_files: {
          ".repost-collection": "",
          "req1env.http": buildHTTPRequest({ path: "/test" }),
          "default.env.json": "{}",
          "README.md": "this is a readme!",
          ".git": { test: "test" },
          node_modules: {
            pkg: { "package.json": "{ }", "index.js": "console.log('hi')" }
          }
        },
        testcoll_nested: {
          ".repost-collection": "",
          "req1nested.http": buildHTTPRequest({ path: "/test" }),
          inner: {
            ".repost-collection": "",
            "req2nested.http": buildHTTPRequest({ path: "/test_two" }),
            "req3nested.http": buildHTTPRequest({ path: "/test" }),
            more: {
              ".repost-collection": "",
              "req2nested.http": buildHTTPRequest({ path: "/test_two" })
            },
            even_more: {
              ".repost-collection": "",
              "req2nested.http": buildHTTPRequest({ path: "/test" })
            }
          }
        },
        testcoll_js: {
          ".repost-collection": "",
          "req1.http": buildHTTPRequest({ path: "/test" }),
          "req2.js":
            "module.exports = {\
            async handler() {\
              return await { data: 'JS Test Response' };\
            }\
          };",
          "default.env.json": '{ "base_url": "http://localhost:8080" }'
        }
      };

      restoreFs = mockFilesystem(files);
      server = mockServer();
      server.onGet("http://localhost:8000/test").reply(200, "Test response");
      server
        .onGet("http://localhost:8000/test_two")
        .reply(200, "Test response 2");
    });

    afterEach(() => {
      restoreFs();
      server.restore();
    });

    it("should return the response data for successful requests", async () => {
      const run = makeRun(mockSession());
      const [{ err, request, response }, ...rest] = await run("request.http");
      expect(request).to.eql("request.http");
      expect(err).not.to.exist;
      expect(response.data).to.eql("Test response");
      expect(rest).to.be.empty;
    });

    it("should return 'Unknown file' error when request do not exist in filesystem", async () => {
      const run = makeRun(mockSession());
      const [{ err, request, response }, ...rest] = await run("bad.http");

      expect(request).to.eql("bad.http");
      expect(err.code).to.eql("ENOENT");
      expect(response).not.to.exist;
      expect(rest).to.be.empty;
    });

    it("should support running more than one request with a single call", async () => {
      const run = makeRun(mockSession());
      const [r1, r2, ...rest] = await run("request.http", "request2.http");
      expect(r1.err).not.to.exist;
      expect(r1.request).to.eql("request.http");
      expect(r1.response.data).to.eql("Test response");
      expect(r2.err).not.to.exist;
      expect(r2.request).to.eql("request2.http");
      expect(r2.response.data).to.eql("Test response 2");
      expect(rest).to.be.empty;
    });

    it("should return both errors and successful results", async () => {
      const run = makeRun(mockSession());
      const [r1, r2, ...rest] = await run("request.http", "request_bad.http");
      expect(r1.err).not.to.exist;
      expect(r1.request).to.eql("request.http");
      expect(r1.response.data).to.eql("Test response");
      expect(r2.err).to.exist;
      expect(r2.request).to.eql("request_bad.http");
      expect(r2.response).not.to.exist;
      expect(rest).to.be.empty;
    });

    it("should support a collection (i.e. a directory)", async () => {
      const run = makeRun(mockSession());
      const [r1, r2, ...rest] = await run("testcollection");
      expect(r1.err).not.to.exist;
      expect(r1.request).to.eql("testcollection\\req1.http");
      expect(r1.response.data).to.eql("Test response");
      expect(r2.err).not.to.exist;
      expect(r2.request).to.eql("testcollection\\req2.http");
      expect(r2.response.data).to.eql("Test response 2");
      expect(rest).to.be.empty;
    });

    it("should support collections with .js test files", async () => {
      const run = makeRun(mockSession());
      const [r1, r2, ...rest] = await run("testcoll_js");
      expect(r1.err).not.to.exist;
      expect(r1.request).to.eql("testcoll_js\\req1.http");
      expect(r1.response.data).to.eql("Test response");
      expect(r2.err).not.to.exist;
      expect(r2.request).to.eql("testcoll_js\\req2.js");
      expect(r2.response.data).to.eql("JS Test Response");
      expect(rest).to.be.empty;
    });

    it("should support nesting collections", async () => {
      const run = makeRun(mockSession());
      const responses = await run("testcoll_nested");
      expect(responses.length).to.eql(5);
      expect(
        responses.map(({ response: { data }, ...rest }) => ({ data, ...rest }))
      ).to.have.deep.members([
        {
          request: "testcoll_nested\\req1nested.http",
          data: "Test response"
        },
        {
          request: "testcoll_nested\\inner\\req2nested.http",
          data: "Test response 2"
        },
        {
          request: "testcoll_nested\\inner\\req3nested.http",
          data: "Test response"
        },
        {
          request: "testcoll_nested\\inner\\more\\req2nested.http",
          data: "Test response 2"
        },
        {
          request: "testcoll_nested\\inner\\even_more\\req2nested.http",
          data: "Test response"
        }
      ]);
    });

    it("should ignore *.env.js and *.env.json files in collection", async () => {
      const run = makeRun(mockSession());
      const [{ err, request, response }, ...rest] = await run("testcoll_env");
      expect(request).to.eql("testcoll_env\\req1env.http");
      expect(err).not.to.exist;
      expect(response.data).to.eql("Test response");
      expect(rest).to.be.empty;
    });

    it("should ignore non-testing files in collection", async () => {
      const run = makeRun(mockSession());
      const [{ err, request, response }, ...rest] = await run(
        "testcoll_other_files"
      );
      expect(request).to.eql("testcoll_other_files\\req1env.http");
      expect(err).not.to.exist;
      expect(response.data).to.eql("Test response");
      expect(rest).to.be.empty;
    });
  });
});
