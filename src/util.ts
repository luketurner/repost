import * as fs from "fs"; // note -- avoiding .promises API, since it causes Node to throw warnings.

const { promisify } = require("util");

const axios = require("axios");
const ejsModule = require("ejs");

export const readFile = promisify(fs.readFile);
export const writeFile = promisify(fs.writeFile);
export const statFile = promisify(fs.stat);
export const readDir = promisify(fs.readdir);
export const mkdir = promisify(fs.mkdir);

const _accessFile = promisify(fs.access);
export const accessFile = async (...args) => {
  try {
    await _accessFile(...args);
    return true;
  } catch (e) {
    return false; // fs.access returns error if file cannot be accessed, we just want false.
  }
};

export const ejs = async (string, context) => {
  const data = await ejsModule.render(string, context, { async: true });
  return data;
};

export const regexGroups = (regex, string) => {
  const match = regex.exec(string);
  if (!match) return [];
  return match.slice(1);
};

export const awaitProps = async object => {
  if (object === null || typeof object !== "object")
    throw new Error("Cannot resolve properties of " + object);
  const result = {};
  await Promise.all(
    Object.entries(object).map(async ([k, v]) => {
      result[k] = await v;
      return;
    })
  );
  return result;
};

export const replaceExtension = (filename, newExt) => {
  return filename.replace(/\.[^.]+?$/, newExt ? `${newExt}` : "");
};

export const watchFile = (filename, fn) => {
  fs.watch(filename, { persistent: false }, fn);
};

export const sendHTTPRequest = async request => {
  return await axios(request);
};

export const sleep = async ms => {
  return new Promise((resolve, reject) => {
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
export const split = (val, delimiter, limit) => {
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
