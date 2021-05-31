export declare type RequestFormat = "http" | "js";
export interface Headers {
    [key: string]: string;
}
export interface RequestQueryParams {
    [key: string]: string;
}
export interface RequestAuthOptions {
    username?: string;
    password?: string;
}
export interface RequestAuth extends Required<RequestAuthOptions> {
}
export declare type RequestBody = any;
export declare type ResponseBody = any;
export interface RequestOptions {
    url?: string;
    baseURL?: string;
    headers?: Headers;
    auth?: RequestAuthOptions;
    params?: RequestQueryParams;
    data?: RequestBody;
}
export interface Request extends Required<Omit<RequestOptions, "auth">> {
    auth?: RequestAuth;
}
export interface Response {
    status: number;
    statusText: string;
    headers: Headers;
    data: ResponseBody;
    request: Request;
}
export interface TryRunResponse {
    response?: Response;
    error?: Error;
    request: string;
}
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
//# sourceMappingURL=interfaces.d.ts.map