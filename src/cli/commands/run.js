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
      defaultValue: "default.env.js"
    }
  ],
  handler: async (session, args) => {
    const { file } = args;

    const responses = await session.run(...file);
    if (responses) session.log.info(print.httpResponseList(responses));
    else session.log.info("No files specified.");
  }
};
