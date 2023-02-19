import * as http from "http";
import * as https from "https";
import { Client } from "../client";
import { RequestType } from "../types";

type RequestOptionsType = {
  url: string;
  method?: RequestType;
  body: {};
  onError: (error: Error) => void;
  callback?: (resp: http.IncomingMessage) => void;
};
export class HttpModule {
  private static instance: HttpModule;
  private host: string;

  constructor() {
    this.host = Client.config.url;
  }

  public static getInstance() {
    if (!HttpModule.instance) {
      HttpModule.instance = new HttpModule();
    }
    return HttpModule.instance;
  }

  public request({
    url,
    method = "POST",
    body,
    onError,
    callback,
  }: RequestOptionsType) {
    const requestOptions = {
      ...this.requestHeaders(method),
      ...this.requestOptions(url, method),
    };

    const httpModule = this.requestModule();

    const request = httpModule.request(requestOptions, callback);
    request.on("error", () => onError);

    this.requestWriteBody(method, request, body);

    request.end();
  }

  private requestWriteBody(
    method: RequestType,
    request: http.ClientRequest,
    body: {}
  ) {
    if (method === "POST") {
      request.write(JSON.stringify(body));
    }
  }

  private requestModule(): typeof http | typeof https {
    return this.clientURL.protocol == "http:" ? http : https;
  }

  private get clientURL(): URL {
    return new URL(this.host);
  }

  private requestOptions(
    url: string,
    method: RequestType
  ): http.RequestOptions {
    const reqUrl = this.clientURL;
    const path = new URL(url, this.host);

    return {
      protocol: reqUrl.protocol,
      port: reqUrl.port,
      host: reqUrl.hostname,
      method,
      path: `${path.pathname}/${Client.config.appId}`,
    };
  }

  private requestHeaders(method: RequestType) {
    const headers = Client.client.headers;
    const baseHeaders = {
      ...headers,
    };
    if (method !== "POST") return baseHeaders;
    return {
      headers: {
        "Content-Type": "application/json",
        ...baseHeaders,
      },
    };
  }
}
