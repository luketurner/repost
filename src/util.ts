import * as fs from "fs"; // note -- avoiding .promises API, since it causes Node to throw warnings.

import { promisify } from "util";

import { render as ejsRender } from "ejs";

export const readFile = promisify(fs.readFile);
export const writeFile = promisify(fs.writeFile);
export const statFile = promisify(fs.stat);
export const readDir = promisify(fs.readdir);
export const mkdir = promisify(fs.mkdir);

const _accessFile = promisify(fs.access);
export const accessFile = async (
  path: fs.PathLike,
  mode?: number
): Promise<boolean> => {
  try {
    await _accessFile(path, mode);
    return true;
  } catch (e) {
    return false; // fs.access returns error if file cannot be accessed, we just want false.
  }
};

export const ejs = async (content: string, context: any): Promise<string> => {
  const data = await ejsRender(content, context, { async: true });
  return data;
};

export const regexGroups = (regex: RegExp, string: any): string[] => {
  const match = regex.exec(string);
  if (!match) return [];
  return match.slice(1);
};

export const replaceExtension = (filename: string, newExt?: string): string => {
  return filename.replace(/\.[^.]+?$/, newExt ? `${newExt}` : "");
};

export const watchFile = (
  filename: fs.PathLike,
  fn: ((event: string, filename: string) => void) | undefined
): fs.FSWatcher => {
  return fs.watch(filename, { persistent: false }, fn);
};

export const sleep = async (ms: number): Promise<void> => {
  return new Promise((resolve, _reject) => {
    setTimeout(resolve, ms);
  });
};

/**
 * Like String#split(), but if there are more than `limit` instances of `delimiter` in the string,
 * the remaining instances will be present in the last segment, instead of being truncated.
 *
 * @param {string} val
 * @param {string} delimiter
 * @param {number} limit
 * @memberof module:repost/util
 */
export const split = (
  val: string,
  delimiter: string,
  limit: number
): string[] => {
  const chunks = [];
  const delimiterLength = delimiter.length;
  let lastIndex = 0;

  while (--limit) {
    const ix = val.indexOf(delimiter, lastIndex);
    chunks.push(val.slice(lastIndex, ix));
    lastIndex = ix + delimiterLength;
  }

  chunks.push(val.slice(lastIndex));
  return chunks;
};
