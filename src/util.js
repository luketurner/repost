const fs = require("fs"); // note -- avoiding .promises API, since it causes Node to throw warnings.
const vm = require("vm");
const path = require("path");

const { promisify } = require("util");

const axios = require("axios");
const ejsModule = require("ejs");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const statFile = promisify(fs.stat);
const readDir = promisify(fs.readdir);
const mkdir = promisify(fs.mkdir);

const _accessFile = promisify(fs.access);
const accessFile = async (...args) => {
  try {
    await _accessFile(...args);
    return true;
  } catch (e) {
    return false; // fs.access returns error if file cannot be accessed, we just want false.
  }
};

const getExecutionContext = (env, session, testContext) => {
  return { ...env, repost: session, test: testContext };
};

const ejs = async (string, context) => {
  const data = await ejsModule.render(string, context, { async: true });
  return data;
};

const regexGroups = (regex, string) => {
  const match = regex.exec(string);
  if (!match) return [];
  return match.slice(1);
};

const awaitProps = async object => {
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

const replaceExtension = (filename, newExt) => {
  return filename.replace(/\.[^.]+?$/, newExt ? `${newExt}` : "");
};

const watchFile = (filename, fn) => {
  fs.watch(filename, { persistent: false }, fn);
};

const sendHTTPRequest = async request => {
  return await axios(request);
};

const sleep = promisify(setTimeout);

/**
 * Like String#split(), but if there are more than `limit` instances of `delimiter` in the string,
 * the remaining instances will be present in the last segment, instead of being truncated.
 *
 * @param {string} val
 * @param {string} delimiter
 * @param {number} limit
 */
const split = (val, delimiter, limit) => {
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

/**
 * @module repost/util
 */
module.exports = {
  readFile,
  writeFile,
  statFile,
  watchFile,
  readDir,
  mkdir,
  accessFile,
  ejs,
  regexGroups,
  awaitProps,
  // awaitParallel,
  // awaitSeries,
  replaceExtension,
  sendHTTPRequest,
  getExecutionContext,
  sleep,
  split
};
