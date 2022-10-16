import { isEmpty } from "../core/is";
import { TraceoOptions } from "../transport/options";
import { Logger } from "./logger";
import { metrics } from "./metrics";
import { loadRuntimeMetrics } from "./metrics/runtime-data";

export class Client {
  options: TraceoOptions;
  readonly logger: Logger;

  constructor(options: TraceoOptions) {
    this.configGlobalClient();

    this.options = options;
    this.logger = new Logger();

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
    return this.options?.metrics?.collect;
  }

  get isConnected(): boolean {
    return !isEmpty(global.__TRACEO__);
  }

  private initSDK(): void {
    if (this.options.metrics.collect) {
      metrics.collectMetrics(this.options);
    }

    loadRuntimeMetrics();
  }

  private configGlobalClient(): void {
    global.__TRACEO__ = this;
  }
}
