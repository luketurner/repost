const fs = require("fs");
const path = require("path");

const util = require("../util");

const FORMATS = requireFormats();

module.exports = {
  formatFactory
};

function formatFactory(ctx) {
  const self = {
    guessFormat(filename) {
      const ext = path.extname(filename);
      for (const fmt of Object.keys(FORMATS)) {
        if (FORMATS[fmt].config.extensions.includes(ext)) {
          return fmt;
        }
      }
      return;
    },

    print(requestObject, format) {
      if (!format) format = "http";
      if (!FORMATS[format]) throw new Error(`Unknown format: ${format}`);
      if (!FORMATS[format].print)
        throw new Error(`Format ${format} does not support printing`);

      return FORMATS[format].print(ctx, requestObject);
    },

    async parse(filename, format) {
      if (!format) {
        format = self.guessFormat(filename);
        if (!format) throw new Error(`Cannot guess format: ${format}`);
      }

      if (!FORMATS[format]) throw new Error(`Unknown format: ${format}`);
      if (!FORMATS[format].parse) {
        throw new Error(`Format ${format} does not support parsing`);
      }

      let content = await util.readFile(filename, "utf8");

      if (FORMATS[format].config.ejs) {
        content = await util.ejs(content, ctx);
      }

      const requestObject = FORMATS[format].parse(ctx, content);
      if (!requestObject.handler) requestObject.handler = util.sendHTTPRequest;

      return requestObject;
    }
  };

  return self;
}

function requireFormats() {
  const fmts = {};

  for (const dir of fs.readdirSync(__dirname)) {
    const realdir = path.join(__dirname, dir);
    if (!fs.statSync(realdir).isDirectory()) continue;
    fmts[dir] = {};
    for (const f of fs.readdirSync(realdir)) {
      fmts[dir][path.basename(f, path.extname(f))] = require(path.join(
        realdir,
        f
      ));
    }
  }

  return fmts;
}
