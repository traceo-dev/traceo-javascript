import { IBrowserClient, TraceoOptions } from "./types/client";
import { Transport } from "./transport";
import { utils } from "./utils";

export abstract class BrowserClient implements IBrowserClient {
  public headers!: { [key: string]: any };
  public options: TraceoOptions;
  public transport: Transport;

  constructor(options: TraceoOptions) {
    this.options = options;
    this.transport = new Transport(this.options);

    this.initSDK();
  }

  public abstract postInitSDK(): void;

  public sendError(error: Error): void {
    const browser = utils.browserDetails();
    this.transport.send({
      type: error.name,
      message: error.message,
      stack: error.stack as string,
      browser
    }, this.headers);
  }

  private initSDK(): void {
    this.postInitSDK();
  }
}
