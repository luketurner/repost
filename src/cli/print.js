const httpResponse = response => {
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
    .map(({ err, response, request }) => {
      return `\n--- ${request} ---\n${err || httpResponse(response)}`;
    })
    .join("\n");
};

module.exports = {
  httpResponse,
  httpResponseList
};
