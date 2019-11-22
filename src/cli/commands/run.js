const print = require("../print");

module.exports = {
  example: "run foo.http",
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
  handler: async (ctx, args) => {
    const { file } = args;

    const responses = await ctx.run(file);
    if (responses) ctx.log.info(print.httpResponseList(responses));
    else ctx.log.info("No files specified.");
  }
};
