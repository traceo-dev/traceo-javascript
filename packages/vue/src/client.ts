import { BrowserClient, ClientOptions, VERSION } from "@traceo-sdk/browser";

export class Client extends BrowserClient {
  constructor(apiKey: string, options: ClientOptions) {
    super({
      headers: {
        "x-sdk-name": "vue",
        "x-sdk-version": VERSION,
        "x-sdk-key": apiKey
      },
      options: {
        ...options,
        apiKey
      }
    });
  }

  public postInitSDK(): void { }
}
