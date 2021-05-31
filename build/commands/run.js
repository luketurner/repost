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
const print_1 = require("../cli/print");
exports.run = {
    name: "run",
    examples: ["run foo.http"],
    description: "Execute one or more requests or collections.",
    options: [
        {
            name: "file",
            defaultOption: true,
            multiple: true,
            type: String,
        },
        {
            name: "env",
            alias: "e",
            type: String,
            description: "The environment file to use",
            defaultValue: "default.env.json",
        },
    ],
    handler: (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const { file } = ctx.args;
        if (!file || !file.length) {
            throw new Error("No files specified.");
        }
        const repostContext = ctx.data.repostContext;
        const responses = yield repostContext.run(file);
        if (responses)
            ctx.console.log(print_1.printHttpResponseList(responses));
        else
            throw new Error("No files specified.");
    }),
};
//# sourceMappingURL=run.js.map