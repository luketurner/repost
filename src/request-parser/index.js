const path = require("path");
const util = require("../util");

const httpParser = require("./http");
const jsParser = require("./js");

module.exports = session => {
  const getParser = request => {
    const ext = path.extname(request);
    return {
      ".http": httpParser,
      ".js": jsParser
    }[ext];
  };

  const parseTestFile = async request => {
    session.log.silly(`parseTestFile(${request})`);
    const [rawText, envData] = await Promise.all([
      util.readFile(request, "utf8"),
      session.envs.getEnvForRequest(request)
    ]);
    if (!rawText) throw new Error("Cannot load test: " + request);
    const scriptContext = { ...envData, session };
    const renderedText = await util.ejs(rawText, scriptContext);

    const parser = getParser(request);
    if (!parser)
      throw new Error("Invalid test file type: " + path.basename(request));

    return await parser.parse(renderedText, scriptContext);
  };

  return { getParser, parseTestFile };
};
