import * as http from "http";
import * as https from "https";
import { RequestType, RequestOptionsType } from "./types";
import { getGlobalTraceo } from "./utils";

/**
 * Http client for SDK requestst
 */
export class HttpClient {
  protected constructor() {}

  /**
   * Make http/s request to Traceo platoform.
   *
   * Default request method is POST, in this case in hedaers is passed "Content-Type": "application/json".
   * URL is concatenation of passed host to client and pathanme to this method.
   * Use callback/onError callbacks to handle action after operation.
   */
  public static request = ({
    url,
    method = "POST",
    body,
    onError,
    callback
  }: RequestOptionsType) => {
    const options = {
      ...this.requestHeaders(method),
      ...this.requestOptions(url, method)
    };

    const httpModule = this.requestModule();

    const request = httpModule.request(options, callback);
    request.on("error", () => onError);

    this.requestWriteBody(method, request, body);

    request.end();
  };

  private static requestWriteBody = (
    method: RequestType,
    request: http.ClientRequest,
    body: {}
  ) => {
    if (method === "POST") {
      request.write(JSON.stringify(body));
    }
  };

  private static requestModule = (): typeof http | typeof https => {
    const protocol = this.clientURL().protocol;
    return protocol == "http:" ? http : https;
  };

  private static clientURL = (): URL => {
    return new URL(getGlobalTraceo().options.host);
  };

  private static requestOptions = (url: string, method: RequestType): http.RequestOptions => {
    const host = getGlobalTraceo().options.host;
    const reqUrl = new URL(host);
    const path = new URL(url, host);

    return {
      protocol: reqUrl.protocol,
      port: reqUrl.port,
      host: reqUrl.hostname,
      method,
      path: path.pathname
    };
  };

  private static requestHeaders = (method: RequestType) => {
    const headers = getGlobalTraceo().headers;

    if (method !== "POST") return headers;
    return {
      headers: {
        "Content-Type": "application/json",
        ...headers
      }
    };
  };
}
