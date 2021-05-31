"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.request = {
    name: "Request",
    aliases: ["req"],
    commands: [
        {
            name: "create",
            example: ["create request FILE"],
            description: "Scaffolds a new request file of the specified format.",
            options: [
                {
                    name: "file",
                    description: 'Desired filename for the request. Use "-" to write to stdout instead of a file.',
                    defaultOption: true,
                    type: String
                },
                {
                    name: "format",
                    description: 'Desired format for the request. Supported formats: "http", "js". If not specified, will be inferred from filename.',
                    type: String
                }
            ],
            handler: (ctx) => __awaiter(void 0, void 0, void 0, function* () {
                let { file, format } = ctx.args;
                const repostContext = ctx.data.repostContext;
                if (!file)
                    return repostContext.log.error("No filename specified.");
                if (!format)
                    format = repostContext.format.guessFormat(file);
                if (!format)
                    return repostContext.log.error("Cannot determine format for request: unsupported extension.");
                const request = {
                    method: "{{ method }}",
                    url: "{{ url }}",
                    data: "{{ body }}",
                    headers: {
                        "{{ header-key }}": "{{ header-value }}"
                    }
                };
                if (file === "-") {
                    return repostContext.log.info(repostContext.format.print(request, format));
                }
                yield repostContext.request.create(file, format, request);
            })
        }
    ]
};
//# sourceMappingURL=request.js.map