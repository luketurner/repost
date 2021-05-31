"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printHttpResponse = response => {
    if (!response.request) {
        // TODO -- not an http response, probably from a custom JS thing. Just assume they set .data
        return response.data;
    }
    return (`${response.request.method} ${response.config.url}\n` + // TODO -- URL doesn't work
        Object.entries(response.headers)
            .map(([k, v]) => `${k}: ${v}`)
            .join("\n") +
        "\n\n" +
        response.data);
};
exports.printHttpResponseList = responseList => {
    return responseList
        .map(({ error, response, request }) => {
        return `\n--- ${request} ---\n${error || exports.printHttpResponse(response)}`;
    })
        .join("\n");
};
//# sourceMappingURL=print.js.map