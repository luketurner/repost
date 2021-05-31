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
exports.collection = {
    name: "Collection",
    aliases: ["coll"],
    commands: [
        {
            name: "create",
            example: ["create collection DIRECTORY"],
            description: "Scaffolds a collection in the directory, which may or may not exist already.",
            options: [
                {
                    name: "dir",
                    defaultOption: true,
                    type: String
                }
            ],
            handler: (ctx) => __awaiter(void 0, void 0, void 0, function* () {
                const { dir } = ctx.args;
                const repostContext = ctx.data.repostContext;
                if (!dir)
                    return repostContext.log.error("No directory name specified.");
                yield repostContext.collection.create(dir);
            })
        }
    ]
};
//# sourceMappingURL=collection.js.map