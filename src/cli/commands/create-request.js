const print = require("../print");

module.exports = {
  example: "create-request FILE",
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
  handler: async (ctx, args) => {
    let { file, format } = args;

    if (!file) return ctx.log.error("No filename specified.");

    if (!format) format = ctx.format.guessFormat(file);
    if (!format)
      return ctx.log.error(
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
      return ctx.log.info(ctx.format.print(request, format));
    }

    await ctx.request.create(file, format, request);
  }
};
