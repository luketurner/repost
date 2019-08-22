const util = require("../util");

const parse = async (fileContents, scriptContext) => {
  const result = await util.eval(fileContents, scriptContext);
  if (!result || typeof result !== "object")
    throw new Error("Javascript test must export object with handler() method");
  return result;
};

module.exports = { parse };
