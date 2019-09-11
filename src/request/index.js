const path = require("path");

const util = require("../util");

const makePrint = require("./print");
const makeParse = require("./parse");

module.exports = session => {
  return {
    parse: makeParse(session),
    print: makePrint(session)
  };
};
