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
exports.environment = {
    name: "Environment",
    aliases: ["env"],
    commands: [
        {
            name: "create",
            example: ["create environment FILE"],
            description: "Scaffolds a *.env.json files with the specified properties.",
            options: [
                {
                    name: "file",
                    alias: "f",
                    defaultOption: true,
                    type: String
                },
                {
                    name: "prop",
                    alias: "p",
                    multiple: true,
                    type: String
                }
            ],
            handler: (ctx) => __awaiter(void 0, void 0, void 0, function* () {
                const { file, prop = [] } = ctx.args;
                const repostContext = ctx.data.repostContext;
                const envProps = prop.reduce((envProps, p) => {
                    const [key, value] = repostContext.util.split(p, "=", 2);
                    if (!value)
                        throw new Error("Environment properties must be of form: KEY=VALUE");
                    return Object.assign(envProps, { [key]: value });
                }, {});
                if (!file)
                    return repostContext.log.error("No filename specified.");
                yield repostContext.envs.create(file, envProps);
            })
        }
    ]
};
//# sourceMappingURL=environment.js.map