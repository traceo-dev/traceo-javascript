import { ITransport, RequestOptions } from "../types/transport";

const XHR_DONE = 4;
export class XhrTransport implements ITransport {
  public _options: RequestOptions;

  constructor(options: RequestOptions) {
    this._options = options;
  }

  public async request(): Promise<void> {
    new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(this._options.method, this._options.url, true);

      this.setRequestHeaders(xhr);

      xhr.onreadystatechange = () => {
        if (xhr.readyState === XHR_DONE) {
          resolve({
            status: xhr.status
          });
        }
      };

      xhr.onerror = reject;
      xhr.send(JSON.stringify(this._options.body));
    });
  }

  private setRequestHeaders(xhr: XMLHttpRequest): void {
    Object.entries(this._options.headers).map(([value, key]) => {
      xhr.setRequestHeader(key, value);
    });
  }
}
