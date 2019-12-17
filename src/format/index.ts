import { readdirSync, statSync } from "fs";
import { join as joinPath, basename, extname } from "path";
import { readFile, ejs, sendHTTPRequest } from "../util";

import { http } from "./http";
import { js } from "./js";

const FORMATS = {
  http,
  js
};

export function formatFactory(ctx) {
  const self = {
    guessFormat(filename) {
      const ext = extname(filename);
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

      let content = await readFile(filename, "utf8");

      if (FORMATS[format].config.ejs) {
        content = await ejs(content, ctx);
      }

      const requestObject = FORMATS[format].parse(ctx, content);
      if (!requestObject.handler) requestObject.handler = sendHTTPRequest;

      return requestObject;
    },

    isSupportedExtension(ext) {
      for (const fmt of Object.keys(FORMATS)) {
        if (FORMATS[fmt].config.extensions.includes(ext)) {
          return true;
        }
      }
      return false;
    }
  };

  return self;
}

function requireFormats() {
  const fmts = {};

  for (const dir of readdirSync(__dirname)) {
    const realdir = joinPath(__dirname, dir);
    if (!statSync(realdir).isDirectory()) continue;
    fmts[dir] = {};
    for (const f of readdirSync(realdir)) {
      fmts[dir][basename(f, extname(f))] = require(joinPath(realdir, f));
    }
  }

  return fmts;
}
