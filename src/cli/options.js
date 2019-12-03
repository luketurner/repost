module.exports = [
  {
    name: "verbose",
    alias: "v",
    lazyMultiple: true,
    type: Boolean,
    description:
      "Increase verbosity level (specify more than once to increase further)"
  },
  {
    name: "help",
    alias: "h",
    type: Boolean,
    description: "Print this usage guide"
  },
  {
    name: "raw",
    alias: "r",
    type: Boolean,
    description: "Output unformatted data for scripting"
  }
];
