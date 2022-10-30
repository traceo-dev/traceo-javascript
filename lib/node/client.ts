import { isEmpty } from "../core/is";
import { TraceoOptions } from "../transport/options";
import { Logger } from "./logger";
import { MetricsProbe } from "./metrics";
import { RuntimeData } from "./metrics/runtime-data";

export class Client {
  private options: TraceoOptions;

  private metricsProbe: MetricsProbe;
  private runtimeData: RuntimeData;

  readonly logger: Logger;

  constructor(options: TraceoOptions) {
    this.configGlobalClient();

    this.options = options;
    this.metricsProbe = new MetricsProbe(this.options);

    this.logger = new Logger();
    this.runtimeData = new RuntimeData();

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

  get isOffline(): boolean {
    return this.options.offline;
  }

  get isCollectMetrics(): boolean {
    return this.options?.collectMetrics;
  }

  get isConnected(): boolean {
    return !isEmpty(global.__TRACEO__);
  }

  private initSDK(): void {
    this.runtimeData.collect();

    if (this.options.collectMetrics) {
      this.metricsProbe.register();
    }
  }

  private configGlobalClient(): void {
    global.__TRACEO__ = this;
  }
}
