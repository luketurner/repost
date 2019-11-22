const util = require("../../util");

const parse = async (ctx, request) => {
  let result = await ctx.evalModule(request);
  if (!result || typeof result !== "object") {
    throw new Error("Javascript test must export object with handler() method");
  }
  return result;
};

module.exports = parse;
