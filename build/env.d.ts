import { RepostContext } from ".";
export interface EnvLoader {
    isEnvFile: (filename: string) => boolean;
    resolveEnvironment: (requestFile: string) => Promise<string | undefined>;
    getEnvironmentProxy: (envName: string) => EnvironmentProxy;
    getEnvironment: (envName: string) => Environment;
}
export interface EnvironmentProxy {
    [key: string]: any;
}
export interface Environment {
    [key: string]: any;
}
/**
 * Factory function for EnvLoader.
 *
 * @param {RepostContext} ctx
 * @returns {EnvLoader}
 */
export declare function envsFactory(ctx: RepostContext): EnvLoader;
//# sourceMappingURL=env.d.ts.map