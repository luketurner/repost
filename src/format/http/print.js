module.exports = (ctx, request) => {
  const { url, method, data, headers } = request;
  const headerString =
    Object.keys(headers).length > 0
      ? Object.keys(headers)
          .map(k => `${k}: ${headers[k]}`)
          .join("\n") + "\n"
      : "";
  return `${method} ${url} HTTP/1.1${headerString} \n\n${data}`;
};
