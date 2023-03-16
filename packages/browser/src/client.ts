import { IBrowserClient, TraceoBrowserError, TraceoOptions } from "./types/client";
import { Transport } from "./transport";
import { utils } from "./utils";
import { stacktrace } from "./exceptions/stacktrace";
import { Trace } from "./types/stacktrace";
import { BrowserIncidentType } from "./types/transport";
import { EventOnErrorType, EventOnUnhandledRejectionType, windowEventHandlers } from "./handlers";
import { BrowserInfoType } from "./types/browser";

export abstract class BrowserClient implements IBrowserClient {
  public headers!: { [key: string]: any };
  public options: TraceoOptions;
  public transport: Transport;
  private browser: BrowserInfoType;

  constructor(options: TraceoOptions) {
    this.options = options;
    this.transport = new Transport(this.options);
    this.browser = utils.browserDetails();

    this.initSDK();
  }

  /**
   * Method to implement dedicated logic only for a specific type of SDK.
   * Implement in dedicated client.
   */
  public abstract postInitSDK(): void;

  /**
   * Method to handle exceptions catched by ErrorBoundary component
   * Use this method via IBrowserClient interface implmeneted in dedicated clients
   * @param error
   */
  public handleError(error: TraceoBrowserError): void {
    const err = this.constructError(error);
    if (err) {
      this.transport.send<BrowserIncidentType>(err, this.headers);
    }
  }

  /**
   * Method to send errors catched by window event handlers like onerror or onunhandledrejection
   * @param error
   */
  private sendError(error: BrowserIncidentType): void {
    this.transport.send<BrowserIncidentType>(error, this.headers);
  }

  private constructError(error?: Error): BrowserIncidentType | null {
    if (!error) {
      console.debug("-- : --");
      return null;
    }

    const type = error?.name || "Error";
    const message = error?.message || "(No message)";

    const stack = error?.stack || "";

    const traces: Trace[] = stacktrace.parse(stack);

    const err: BrowserIncidentType = {
      type,
      message,
      stack,
      traces,
      browser: this.browser
    };

    return err;
  }

  private initSDK(): void {
    if (this.isOffline) {
      return;
    }

    if (window !== undefined) {
      this.initWindowEventHandlers();
    }

    this.postInitSDK();
  }

  private initWindowEventHandlers() {
    /**
     * Event handlers setup to catch exceptions via native js mechanism
     */

    windowEventHandlers["onerror"]((data: EventOnErrorType) => this.handleOnErrorEvent(data));
    windowEventHandlers["unhandledrejection"]((data: EventOnUnhandledRejectionType) =>
      this.handleOnUnhandledRejectionEvent(data)
    );
  }

  private handleOnErrorEvent = (data: EventOnErrorType) => {
    if (data.error) {
      const eventError = this.constructError(data?.error);
      if (!eventError) {
        console.debug("-- --- --");
        return;
      }

      if (data?.event) {
        eventError.type = data.event.toString();
      }

      this.sendError(eventError);
    }
  };

  private handleOnUnhandledRejectionEvent = (data: EventOnUnhandledRejectionType) => {
    // Without reason inside event there is no informations about catched exception
    if ("reason" in data.event) {
      const reason = data.event.reason;

      const type = "Unhandled rejection";
      const message = reason.message;

      let stack = "";
      if ("stack" in reason) {
        stack = reason.stack;
      } else {
        stack = reason.toString();
      }

      const traces: Trace[] = stacktrace.parse(stack);
      const err: BrowserIncidentType = {
        type,
        message,
        stack,
        traces,
        browser: this.browser
      };

      this.sendError(err);
    }
  };

  private get isOffline(): boolean | undefined {
    return this.options.offline;
  }
}
