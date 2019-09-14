const parse = require("./parse");
const print = require("./print");

module.exports = session => ({
  parse,
  print,
  ejs: true
});
