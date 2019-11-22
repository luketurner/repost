const util = require("../../util");

class RequestParseError extends Error {
  constructor(fieldName, value, context) {
    super();
    this.message = `Request has invalid ${fieldName}: ${value}.\n  from: ${context}`;
  }
}

const parseRequestLine = line => {
  const [method, url, httpVersion] = util.regexGroups(
    /^([A-Z]+) (.+?) (HTTP\/[\d.]+)$/g,
    line
  );
  if (!method) throw new RequestParseError("URI", url, line);
  if (!url) throw new RequestParseError("Method", method, line);
  if (httpVersion !== "HTTP/1.1")
    console.warn(
      "Unknown HTTP version in test request (expected HTTP/1.1):",
      httpVersion
    );
  return { method, url };
};

const parseHeader = line => {
  const [key, value] = util.regexGroups(/^([\w\d_-]+):(.+)$/g, line);
  if (!key || !value.trim()) {
    console.warn("Skipping badly-formatted header:", key, ":", value);
    return {};
  }
  return { [key.toLowerCase()]: value.trim() };
};

const parseHeaders = headers => {
  return {
    headers: headers
      .split("\n")
      .reduce((acc, l) => Object.assign(acc, parseHeader(l)), {})
  };
};

const parseBody = body => {
  return { data: body }; // easy?!
};

const parse = (ctx, httpRequest) => {
  httpRequest = httpRequest.replace(/\r\n/g, "\n"); // Convert newlines to consistent format in case requests come from windows

  const headerStartIndex = httpRequest.indexOf("\n") + 1;
  const bodyStartIndex = httpRequest.indexOf("\n\n") + 2;

  const hasHeader = headerStartIndex !== -1 + 1;
  const hasBody = bodyStartIndex !== -1 + 2;

  const requestLineString = httpRequest.substring(0, headerStartIndex).trim();
  const headerString = hasHeader
    ? httpRequest
        .substring(headerStartIndex, hasBody ? bodyStartIndex - 2 : undefined)
        .trim()
    : "";
  const bodyString = hasBody ? httpRequest.substring(bodyStartIndex) : "";

  const parsedRequestLine = parseRequestLine(requestLineString);
  const parsedHeaders = headerString ? parseHeaders(headerString) : {};
  const parsedBody = bodyString ? parseBody(bodyString) : {};

  return {
    ...parsedRequestLine,
    ...parsedHeaders,
    ...parsedBody
  };
};

module.exports = parse;
