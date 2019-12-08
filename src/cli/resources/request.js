module.exports = {
  name: "request",
  aliases: ["req"],

  commands: [
    {
      name: "create",
      example: ["create request FILE"],
      description: "Scaffolds a new request file of the specified format.",
      options: [
        {
          name: "file",
          description:
            'Desired filename for the request. Use "-" to write to stdout instead of a file.',
          defaultOption: true,
          type: String
        },
        {
          name: "format",
          description:
            'Desired format for the request. Supported formats: "http", "js". If not specified, will be inferred from filename.',
          type: String
        }
      ],
      handler: async ctx => {
        let { file, format } = ctx.args;
        const repostContext = ctx.data.repostContext;

        if (!file) return repostContext.log.error("No filename specified.");

        if (!format) format = repostContext.format.guessFormat(file);
        if (!format)
          return repostContext.log.error(
            "Cannot determine format for request: unsupported extension."
          );

        const request = {
          method: "{{ method }}",
          url: "{{ url }}",
          data: "{{ body }}",
          headers: {
            "{{ header-key }}": "{{ header-value }}"
          }
        };

        if (file === "-") {
          return repostContext.log.info(
            repostContext.format.print(request, format)
          );
        }

        await repostContext.request.create(file, format, request);
      }
    }
  ]
};
