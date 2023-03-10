import { BrowserClient, TraceoOptions } from "@traceo-sdk/browser";
const { version } = require('./package.json');

export class Client extends BrowserClient {
  constructor(options: TraceoOptions) {
    super(options);

    this.options = options;
    this.headers = {
      "x-sdk-name": "React",
      "x-sdk-version": version,
      "x-sdk-key": this.options.apiKey
    };
  }

  public postInitSDK(): void { }
}
