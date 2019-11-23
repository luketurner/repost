const print = require("../print");

module.exports = {
  example: "create-collection DIRECTORY",
  description:
    "Scaffolds a collection in the directory, which may or may not exist already.",
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
