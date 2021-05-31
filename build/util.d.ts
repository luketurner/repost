/// <reference types="node" />
import * as fs from "fs";
export declare const readFile: typeof fs.readFile.__promisify__;
export declare const writeFile: typeof fs.writeFile.__promisify__;
export declare const statFile: typeof fs.stat.__promisify__;
export declare const readDir: typeof fs.readdir.__promisify__;
export declare const mkdir: typeof fs.mkdir.__promisify__;
export declare const accessFile: (path: fs.PathLike, mode?: number | undefined) => Promise<boolean>;
export declare const ejs: (content: string, context: any) => Promise<string>;
export declare const regexGroups: (regex: RegExp, string: any) => string[];
export declare const replaceExtension: (filename: string, newExt?: string | undefined) => string;
export declare const watchFile: (filename: fs.PathLike, fn: ((event: string, filename: string) => void) | undefined) => fs.FSWatcher;
export declare const sleep: (ms: number) => Promise<void>;
/**
 * Like String#split(), but if there are more than `limit` instances of `delimiter` in the string,
 * the remaining instances will be present in the last segment, instead of being truncated.
 *
 * @param {string} val
 * @param {string} delimiter
 * @param {number} limit
 * @memberof module:repost/util
 */
export declare const split: (val: string, delimiter: string, limit: number) => string[];
//# sourceMappingURL=util.d.ts.map