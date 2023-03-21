import { BrowserClient, TraceoOptions, VERSION } from "@traceo-sdk/browser";

export class Client extends BrowserClient {
  constructor(options: TraceoOptions) {
    super({
      headers: {
        "x-sdk-name": "vue",
        "x-sdk-version": VERSION,
        "x-sdk-key": options.apiKey
      },
      options
    });
  }

  public postInitSDK(): void { }
}
