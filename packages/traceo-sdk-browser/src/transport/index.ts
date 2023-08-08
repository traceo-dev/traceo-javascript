import { BrowserClientConfigType, Dictionary } from "../types/client";
import { RequestOptions } from "../types/transport";
import { FetchTransport } from "./fetch";
import { XhrTransport } from "./xhr";

export class Transport {
  private _options: BrowserClientConfigType;

  constructor(options: BrowserClientConfigType) {
    this._options = options;
  }

  public send<T>(url: string, body: T, headers: Dictionary<string>) {
    const options = this.requestOptions<T>(url, body, headers);
    this.transport<T>(options).request();
  }

  private transport<T>(options: RequestOptions<T>) {
    if (window.XMLHttpRequest && !window.fetch) {
      return new XhrTransport<T>(options);
    }

    return new FetchTransport<T>(options);
  }

  private requestOptions<T>(
    url: string,
    body: T,
    headers: Dictionary<string>
  ): RequestOptions<T> {
    const reqUrl = this.clientURL;
    const hostUrl = `${reqUrl.origin}${url}`;

    return {
      protocol: reqUrl.protocol,
      headers: {
        "Content-Type": "application/json",
        ...headers
      },
      host: reqUrl.hostname,
      method: "POST",
      url: hostUrl,
      port: reqUrl.port,
      body
    };
  }

  private get clientURL(): URL {
    return new URL(this._options.options.host);
  }
}
