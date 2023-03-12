import { IBrowserClient, TraceoOptions } from "./types/client";
import { Transport } from "./transport";
import { utils } from "./utils";
import { stacktrace } from "./exceptions/stacktrace";
import { Trace } from "./types/stacktrace";
import { BrowserIncidentType } from "./types/transport";

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
    const err = this.constructError(error);
    this.transport.send<BrowserIncidentType>(err, this.headers);
  }

  private constructError(error: Error): BrowserIncidentType {
    const browser = utils.browserDetails();

    const type = error.name;
    const message = error.message;

    const stack = error.stack || "";

    const traces: Trace[] = stacktrace.parse(stack);

    const err: BrowserIncidentType = {
      type,
      message,
      stack,
      traces,
      browser
    };

    return err;
  }

  private initSDK(): void {
    this.postInitSDK();
  }
}
