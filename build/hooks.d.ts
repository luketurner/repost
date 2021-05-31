import { Request, Response } from "./interfaces";
import { RepostContext } from ".";
/**
 * @interface Hooks
 * @global
 * @property {Function} before (request) => transformedRequest
 * @property {Function} after (response) => transformedResponse
 */
export interface Hooks {
    before: (request: Request) => Request;
    after: (request: Response) => Response;
}
export interface HookLoader {
    loadHooks(filename: string): Promise<Hooks>;
    isHookFile(filename: string): Promise<boolean>;
}
/**
 * Factory for JSHookLoaders.
 *
 * @param {RepostContext} ctx
 * @returns {JSHookLoader}
 */
export declare function hookFactory(ctx: RepostContext): HookLoader;
//# sourceMappingURL=hooks.d.ts.map