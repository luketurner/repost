module.exports = (ctx, request) => {
  return `module.exports = {
  handler() {
    return ${JSON.stringify(request)};
  }
}`;
};
