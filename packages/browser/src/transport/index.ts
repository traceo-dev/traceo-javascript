import { Dictionary, TraceoOptions } from "../types/client";
import { RequestOptions } from "../types/transport";
import { FetchTransport } from "./fetch";
import { XhrTransport } from "./xhr";

export class Transport {
  private _options: TraceoOptions;

  constructor(options: TraceoOptions) {
    this._options = options;
  }

  public send(body: object, headers: Dictionary<string>) {
    try {
      const options = this.requestOptions(body, headers);
      this.transport(options).request();
    } catch (error) {
      console.log("Error on send data: ", error);
    }
  }

  private transport(options: RequestOptions) {
    if (window.XMLHttpRequest && !window.fetch) {
      return new XhrTransport(options);
    }

    return new FetchTransport(options);
  }

  private requestOptions(body: {}, headers: Dictionary<string>): RequestOptions {
    const reqUrl = this.clientURL;

    // http://localhost:3000/api/worker/incident/app-id
    const url = `${reqUrl.origin}/api/worker/incident/${this._options.appId}`;

    return {
      protocol: reqUrl.protocol,
      headers: {
        "Content-Type": "application/json",
        ...headers
      },
      host: reqUrl.hostname,
      method: "POST",
      url,
      port: reqUrl.port,
      body
    };
  }

  private get clientURL(): URL {
    return new URL(this._options.url);
  }
}
