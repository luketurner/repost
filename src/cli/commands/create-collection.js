const print = require("../print");

module.exports = {
  example: "create-collection DIRECTORY",
  description:
    "Initializes a collection in the specified directory. Directory will be created if it doesn't already exist.",
  options: [
    {
      name: "dir",
      defaultOption: true,
      type: String
    }
  ],
  handler: async (ctx, args) => {
    const { dir } = args;

    if (!dir) return ctx.log.error("No directory name specified.");
    await ctx.collection.create(dir);
  }
};
