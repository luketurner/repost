const PRINTERS = {
  http: require("./http"),
  js: require("./js")
};

module.exports = session => (requestObject, { format } = {}) => {
  format = format || "http";

  const printer = PRINTERS[format];
  if (!printer)
    throw new Error(`canont print request, unknown format: ${format}`);

  return printer(requestObject);
};
