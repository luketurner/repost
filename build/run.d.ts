import { TryRunResponse } from "./interfaces";
import { RepostContext } from ".";
export interface Runner {
    (filenames: any): Promise<TryRunResponse[]>;
}
/**
 * Runner factory.
 *
 * @param {*} ctx
 * @returns {*}
 */
export declare function runnerFactory(ctx: RepostContext): Runner;
//# sourceMappingURL=run.d.ts.map