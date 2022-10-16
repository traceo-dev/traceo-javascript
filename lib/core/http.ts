import * as http from "http";
import * as https from "https";
import { Client } from "../node/client";
import { RequestType } from "../transport/types";

type HttpRequestOptions = {
  callback?: (stream: http.IncomingMessage) => void;
  onError?: (error: Error) => void;
};
export class HttpModule {
  host: string;
  url: URL;
  body: string;
  method: RequestType;

  constructor(url: string, body?: {}, method: RequestType = "POST") {
    this.host = Client.config.url;

    this.url = new URL(url, this.host);
    this.body = JSON.stringify(body);
    this.method = method;
  }

  // TODO: implement callbacks from options later
  public request(_options?: HttpRequestOptions) {
    const requestOptions = {
      ...this.requestHeaders(),
      ...this.requestOptions(),
    };

    const httpModule = this.requestModule();

    const request = httpModule.request(requestOptions);
    request.on("error", () => {});

    this.requestWriteBody(request);

    request.end();
  }

  private requestWriteBody(request: http.ClientRequest) {
    if (this.method === "POST") {
      request.write(this.body);
    }
  }

  private requestModule(): typeof http | typeof https {
    return this.clientURL.protocol == "http:" ? http : https;
  }

  private get clientURL(): URL {
    return new URL(this.host);
  }

  private requestOptions(): http.RequestOptions {
    const reqUrl = this.clientURL;

    return {
      protocol: reqUrl.protocol,
      port: reqUrl.port,
      host: reqUrl.hostname,
      method: this.method,
      path: this.path,
    };
  }

  private get path() {
    return `${this.url.pathname}/${Client.config.appId}`;
  }

  private requestHeaders() {
    if (this.method != "POST") return {};
    return {
      headers: {
        "Content-Type": "application/json",
        "Content-Length": this.body.length,
      },
    };
  }
}
