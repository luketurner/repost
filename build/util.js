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
const fs = require("fs"); // note -- avoiding .promises API, since it causes Node to throw warnings.
const util_1 = require("util");
const ejs_1 = require("ejs");
exports.readFile = util_1.promisify(fs.readFile);
exports.writeFile = util_1.promisify(fs.writeFile);
exports.statFile = util_1.promisify(fs.stat);
exports.readDir = util_1.promisify(fs.readdir);
exports.mkdir = util_1.promisify(fs.mkdir);
const _accessFile = util_1.promisify(fs.access);
exports.accessFile = (path, mode) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield _accessFile(path, mode);
        return true;
    }
    catch (e) {
        return false; // fs.access returns error if file cannot be accessed, we just want false.
    }
});
exports.ejs = (content, context) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield ejs_1.render(content, context, { async: true });
    return data;
});
exports.regexGroups = (regex, string) => {
    const match = regex.exec(string);
    if (!match)
        return [];
    return match.slice(1);
};
exports.replaceExtension = (filename, newExt) => {
    return filename.replace(/\.[^.]+?$/, newExt ? `${newExt}` : "");
};
exports.watchFile = (filename, fn) => {
    return fs.watch(filename, { persistent: false }, fn);
};
exports.sleep = (ms) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, _reject) => {
        setTimeout(resolve, ms);
    });
});
/**
 * Like String#split(), but if there are more than `limit` instances of `delimiter` in the string,
 * the remaining instances will be present in the last segment, instead of being truncated.
 *
 * @param {string} val
 * @param {string} delimiter
 * @param {number} limit
 * @memberof module:repost/util
 */
exports.split = (val, delimiter, limit) => {
    const chunks = [];
    const delimiterLength = delimiter.length;
    let lastIndex = 0;
    while (--limit) {
        const ix = val.indexOf(delimiter, lastIndex);
        chunks.push(val.slice(lastIndex, ix));
        lastIndex = ix + delimiterLength;
    }
    chunks.push(val.slice(lastIndex));
    return chunks;
};
//# sourceMappingURL=util.js.map