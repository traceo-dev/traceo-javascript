import * as http from "http";
import * as https from "https";
import { Client } from "../node/client";
import { RequestType } from "../transport/types";

type RequestOptionsType = {
  body: {};
  onError: (error: Error) => void;
};
export class HttpModule {
  host: string;
  url: URL;
  method: RequestType;

  constructor(url: string, method: RequestType = "POST") {
    this.host = Client.config.url;

    this.url = new URL(url, this.host);
    this.method = method;
  }

  public request(options: RequestOptionsType) {
    const { body, onError } = options;

    const requestOptions = {
      ...this.requestHeaders(),
      ...this.requestOptions(),
    };

    const httpModule = this.requestModule();

    const request = httpModule.request(requestOptions);
    request.on("error", () => onError);

    this.requestWriteBody(request, body);

    request.end();
  }

  private requestWriteBody(request: http.ClientRequest, body: {}) {
    if (this.method === "POST") {
      request.write(JSON.stringify(body));
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
      },
    };
  }
}
