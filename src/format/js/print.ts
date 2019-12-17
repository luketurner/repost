import { inspect } from "util";

export const print = (ctx, request) => {
  return `module.exports = {
  handler() {
    return ${inspect(request)};
  }
}`;
};
