"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
exports.print = (_ctx, request) => {
    return `module.exports = {
  handler() {
    return ${util_1.inspect(request)};
  }
}`;
};
//# sourceMappingURL=print.js.map