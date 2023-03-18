import { ITransport, RequestOptions } from "../types/transport";

export class FetchTransport<T> implements ITransport {
  private _options: RequestOptions<T>;

  constructor(options: RequestOptions<T>) {
    this._options = options;
  }

  public async request(): Promise<any> {
    const options: RequestInit = {
      method: this._options.method,
      headers: this._options.headers,
      body: JSON.stringify(this._options.body)
    };

    try {
      await fetch(this._options.url, options);
    } catch (error) {
      throw new Error(
        `[Traceo SDK] Cannot send data to Traceo Platform. Make sure the application is running. Caused by: ${error}`
      );
    }
  }
}
