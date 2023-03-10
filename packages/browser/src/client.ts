import { IBrowserClient, TraceoOptions } from "./types/client";
import { Transport } from "./transport";

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
    const event = {
      type: error.name,
      message: error.message,
      traces: [],
      stack: error.stack,
      platform: {}
    };
    this.transport.send(event, this.headers);
  }

  private initSDK(): void {
    // TODO: we need to make something here?
    this.postInitSDK();
  }
}
