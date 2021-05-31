"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const util_1 = require("../util");
const http_1 = require("./http");
const js_1 = require("./js");
const FORMATS = {
    http: http_1.http,
    js: js_1.js
};
function formatFactory(ctx) {
    const self = {
        guessFormat(filename) {
            const ext = path_1.extname(filename);
            for (const fmt of Object.keys(FORMATS)) {
                if (FORMATS[fmt].config.extensions.includes(ext)) {
                    return fmt;
                }
            }
            return undefined;
        },
        print(requestObject, format) {
            if (!format)
                format = "http";
            if (!FORMATS[format])
                throw new Error(`Unknown format: ${format}`);
            if (!FORMATS[format].print)
                throw new Error(`Format ${format} does not support printing`);
            return FORMATS[format].print(ctx, requestObject);
        },
        parse(filename, format) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!format) {
                    format = self.guessFormat(filename);
                    if (!format)
                        throw new Error(`Cannot guess format: ${format}`);
                }
                if (!FORMATS[format])
                    throw new Error(`Unknown format: ${format}`);
                if (!FORMATS[format].parse) {
                    throw new Error(`Format ${format} does not support parsing`);
                }
                let content = yield util_1.readFile(filename, "utf8");
                if (FORMATS[format].config.ejs) {
                    content = yield util_1.ejs(content, ctx);
                }
                const requestObject = FORMATS[format].parse(ctx, content);
                if (!requestObject.handler)
                    requestObject.handler = util_1.sendHTTPRequest;
                return requestObject;
            });
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
exports.formatFactory = formatFactory;
//# sourceMappingURL=index.js.map