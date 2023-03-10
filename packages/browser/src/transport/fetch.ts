import { ITransport, RequestOptions } from "../types/transport";

export class FetchTransport implements ITransport {
  private _options: RequestOptions;

  constructor(options: RequestOptions) {
    this._options = options;
  }

  public async request(): Promise<any> {
    const options: RequestInit = {
      method: this._options.method,
      headers: this._options.headers,
      body: JSON.stringify(this._options.body)
    };

    await fetch(this._options.url, options);
  }
}
