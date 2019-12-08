module.exports = {
  name: "Environment",
  aliases: ["env"],

  commands: [
    {
      name: "create",
      example: ["create environment FILE"],
      description:
        "Scaffolds a *.env.json files with the specified properties.",
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
      handler: async ctx => {
        const { file, prop = [] } = ctx.args;
        const repostContext = ctx.data.repostContext;

        const envProps = prop.reduce((envProps, p) => {
          const [key, value] = repostContext.util.split(p, "=", 2);
          if (!value)
            throw new Error(
              "Environment properties must be of form: KEY=VALUE"
            );
          return Object.assign(envProps, { [key]: value });
        }, {});
        if (!file) return repostContext.log.error("No filename specified.");
        await repostContext.envs.create(file, envProps);
      }
    }
  ]
};
