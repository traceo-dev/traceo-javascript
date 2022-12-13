import { IClientMetrics } from "../core/interfaces/metrics";
import { TRACEO_SDK_VERSION } from "../core/version";
import { TraceoOptions } from "../transport/options";
import { Logger } from "./logger";
import { Metrics } from "./metrics";
import { RuntimeData } from "./metrics/default/runtime-data";

export class Client {
  public headers: { [key: string]: any };

  private _metrics: Metrics;
  private runtimeData: RuntimeData;

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
    this.runtimeData = new RuntimeData();

    this._metrics = new Metrics();

    if (!this.isOffline) {
      this.initSDK();
    }
  }

  public static get client(): Client {
    return global.__TRACEO__;
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
    this.runtimeData.collect();

    if (this.options.collectMetrics) {
      this._metrics.register();
    }
  }

  public metrics(): IClientMetrics {
    return this._metrics;
  }

  private configGlobalClient(): void {
    global.__TRACEO__ = this;
  }
}
