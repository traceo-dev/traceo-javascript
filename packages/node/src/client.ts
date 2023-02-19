import { Logger } from "./logger";
import { Metrics } from "./metrics";
import { Scrapper } from "./scrapper";
import { TraceoOptions } from "./types";
import { TRACEO_SDK_VERSION } from "./version";

export class Client {
  public headers: { [key: string]: any };

  private _metrics: Metrics;
  private scrappedData: Scrapper;

  public readonly logger: Logger;
  public options: TraceoOptions;

  constructor(options: TraceoOptions) {
    this.configGlobalClient();

    this.options = options;
    this.headers = {
      "x-sdk-name": "Node.js",
      "x-sdk-version": TRACEO_SDK_VERSION,
      "x-sdk-key": this.options.apiKey,
    };

    this.logger = new Logger();
    this.scrappedData = new Scrapper();

    this._metrics = new Metrics();

    if (!this.isOffline) {
      this.initSDK();
    }
  }

  public static get client(): Client {
    return global["__TRACEO__"];
  }

  public static get logger(): Logger {
    return this.client.logger;
  }

  public static get config(): TraceoOptions {
    return this.client.options;
  }

  private get isOffline(): boolean {
    return this.options.offline;
  }

  private initSDK(): void {
    this.scrappedData.collect();

    if (this.options.collectMetrics) {
      this._metrics.register();
    }
  }

  // private metrics(): IClientMetrics {
  //   return this._metrics;
  // }

  private configGlobalClient(): void {
    global["__TRACEO__"] = this;
  }
}
