const path = require("path");
const util = require("../../util");

const httpParser = require("./http");
const jsParser = require("./js");

const REQUEST_FORMATS = {
  ".http": {
    parser: httpParser,
    ejs: true
  },
  ".js": {
    parser: jsParser,
    ejs: false
  }
};

const getRequestParseInfo = request => {
  const ext = path.extname(request);
  return REQUEST_FORMATS[ext];
};

module.exports = session => {
  const parse = async request => {
    session.log.silly(`parseTestFile(${request})`);

    const { parser, ejs } = getRequestParseInfo(request) || {};

    if (!parser) {
      throw new Error(
        "Request file has unsupported extension: " + path.basename(request)
      );
    }

    const [rawText, envData] = await Promise.all([
      util.readFile(request, "utf8"),
      session.envs.getEnvForRequest(request)
    ]);

    if (!rawText) throw new Error("Cannot load request: " + request);

    const scriptContext = { ...envData, session };

    const renderedText = ejs ? await util.ejs(rawText, scriptContext) : rawText;

    return await parser.parse(renderedText, scriptContext);
  };

  return parse;
};
