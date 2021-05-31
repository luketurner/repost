import { TryRunResponse, Response, RequestFormat, Request } from "./interfaces";
import { RepostContext } from ".";
export interface FileRequestRunner {
    tryRun: (filename: string) => Promise<TryRunResponse>;
    run: (filename: string) => Promise<Response>;
    isRequest: (filename: String) => Promise<boolean>;
    create: (filename: string, format: RequestFormat, request: Request) => Promise<string>;
}
export declare function requestFactory(ctx: RepostContext): FileRequestRunner;
//# sourceMappingURL=request.d.ts.map