const print = require("../print");

module.exports = {
  name: "run",
  examples: ["run foo.http"],
  description: "Execute one or more requests or collections.",
  options: [
    {
      name: "file",
      defaultOption: true,
      multiple: true,
      type: String
    },
    {
      name: "env",
      alias: "e",
      type: String,
      description: "The environment file to use",
      defaultValue: "default.env.json"
    }
  ],
  handler: async ctx => {
    const { file } = ctx.args;
    if (!file || !file.length) {
      throw new Error("No files specified.");
    }

    const repostContext = ctx.data.repostContext;

    const responses = await repostContext.run(file);
    if (responses) ctx.console.log(print.httpResponseList(responses));
    else throw new Error("No files specified.");
  }
};
