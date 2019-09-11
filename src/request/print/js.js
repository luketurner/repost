module.exports = requestObject => {
  return `module.exports = {
  handler() {
    return ${JSON.stringify(requestObject)};
  }
}`;
};
