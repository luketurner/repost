const print = require("../print");

module.exports = {
  example: "create-env FILE",
  description: "Scaffolds a *.env.json files with the specified properties.",
  options: [
    {
      name: "file",
      alias: "f",
      defaultOption: true,
      type: String
    },
    {
      name: "prop",
      alias: "p",
      multiple: true,
      type: String
    }
  ],
  handler: async (ctx, args) => {
    const { file, prop = [] } = args;

    console.log("props", prop);

    const envProps = prop.reduce((envProps, p) => {
      const [key, value] = ctx.util.split(p, "=", 2);
      console.log("p", p, key, value);
      if (!value)
        throw new Error("Environment properties must be of form: KEY=VALUE");
      return Object.assign(envProps, { [key]: value });
    }, {});
    if (!file) return ctx.log.error("No filename specified.");
    await ctx.envs.create(file, envProps);
  }
};
