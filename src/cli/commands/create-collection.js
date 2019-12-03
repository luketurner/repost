const print = require("../print");

module.exports = {
  name: "create-collection",
  example: ["create-collection DIRECTORY"],
  description:
    "Scaffolds a collection in the directory, which may or may not exist already.",
  options: [
    {
      name: "dir",
      defaultOption: true,
      type: String
    }
  ],
  handler: async ctx => {
    const { dir } = ctx.args;
    const repostContext = ctx.data.repostContext;

    if (!dir) return repostContext.log.error("No directory name specified.");
    await repostContext.collection.create(dir);
  }
};
