const util = require("util");

module.exports = (ctx, request) => {
  return `module.exports = {
  handler() {
    return ${util.inspect(request)};
  }
}`;
};
