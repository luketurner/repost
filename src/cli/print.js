const httpResponse = response => {
  if (!response.request) {
    // TODO -- not an http response, probably from a custom JS thing. Just assume they set .data
    return response.data;
  }
  return (
    `${response.request.method} ${response.config.url}\n` + // TODO -- URL doesn't work
    Object.entries(response.headers)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n") +
    "\n\n" +
    response.data
  );
};

const httpResponseList = responseList => {
  return responseList
    .map(({ error, response, request }) => {
      return `\n--- ${request} ---\n${error || httpResponse(response)}`;
    })
    .join("\n");
};

module.exports = {
  httpResponse,
  httpResponseList
};
