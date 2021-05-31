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
const cli_of_mine_1 = require("cli-of-mine");
const __1 = require("..");
const options_1 = require("../options");
const run_1 = require("../commands/run");
const collection_1 = require("../resources/collection");
const environment_1 = require("../resources/environment");
const request_1 = require("../resources/request");
// a little odd. Don't actually compile/copy this file to the output directory, just reference it
// (the path is the same from source vs. built code)
const packageJson = require("../../package.json");
function cli(config) {
    return __awaiter(this, void 0, void 0, function* () {
        config = Object.assign({}, config);
        return cli_of_mine_1.exec({
            name: packageJson.name,
            description: packageJson.description,
            version: packageJson.version,
            stdin: config.stdin,
            stdout: config.stdout,
            stderr: config.stderr,
            argv: config.argv,
            errorStrategy: config.errorStrategy,
            examples: ["repost run foo.http"],
            handler: getBaseHandler(config),
            options: options_1.options,
            subcommands: [run_1.run],
            resources: [collection_1.collection, environment_1.environment, request_1.request],
        });
    });
}
exports.cli = cli;
function getBaseHandler(config) {
    return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        if (!ctx.subcommand) {
            throw new cli_of_mine_1.AppError("MISSING_SUBCOMMAND", "Usage: repost COMMAND");
        }
        const baseContext = config.context ||
            (yield __1.createContext(Object.assign(Object.assign({}, ctx.args), { console: ctx.console })));
        if (config.context) {
            config.context.config.console = ctx.console;
        }
        ctx.data.repostContext = baseContext;
        return next();
    });
}
//# sourceMappingURL=index.js.map