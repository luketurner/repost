import { RepostContext } from ".";
export interface Logger {
    error: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    info: (...args: any[]) => void;
    verbose: (...args: any[]) => void;
    debug: (...args: any[]) => void;
    silly: (...args: any[]) => void;
}
/**
 * Logger factory
 *
 * @param {RepostContext} ctx
 * @returns {Logger}
 */
export declare function loggerFactory(ctx: RepostContext): Logger;
//# sourceMappingURL=log.d.ts.map