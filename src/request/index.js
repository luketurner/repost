const path = require("path");

const util = require("../util");

const REQUEST_FORMATS = {
  http: require("./http"),
  js: require("./js")
};

const getRequestFormat = request => {
  return path.extname(request).slice(1);
};

const getRequestFormatInfo = format => {
  const info = REQUEST_FORMATS[format];
  if (!format || !info)
    throw new Error(`Unsupported request format: ${format}`);

  return info;
};

module.exports = session => {
  return {
    async parse(request) {
      session.log.silly(`parseTestFile(${request})`);

      const { parse, ejs } = getRequestFormatInfo(getRequestFormat(request))(
        session
      );

      const [rawText, envData] = await Promise.all([
        util.readFile(request, "utf8"),
        session.envs.getEnvForRequest(request)
      ]);

      if (!rawText) throw new Error("Cannot load request: " + request);

      const scriptContext = { ...envData, session };

      const renderedText = ejs
        ? await util.ejs(rawText, scriptContext)
        : rawText;

      return await parse(renderedText, scriptContext);
    },
    print(requestObject, format) {
      const { print } = getRequestFormatInfo(format);
      return print(requestObject);
    }
  };
};
