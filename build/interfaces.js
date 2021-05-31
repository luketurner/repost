"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This interface defines the core properties expected to be on a Repost response object.
 *
 * Depending on the request's handler implementation, additional properties might be present, and will be ignored.
 *
 * @interface Response
 * @global
 * @property {number} status
 * @property {string} statusText
 * @property {Object} headers
 * @property {Object | string} data
 * @property {Request} request
 */
/**
 *
 * @interface TryRunResponse
 * @global
 * @property {Response} response
 * @property {Error} error
 * @property {string} request
 */
//# sourceMappingURL=interfaces.js.map