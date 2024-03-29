import { INodeClient, CoreClient, TraceoOptions, Dictionary } from "@traceo-sdk/node-core";
import { Logger } from "./logger";
import { MetricsRunner } from "./metrics";

export class Client extends CoreClient implements INodeClient {
  public headers: Dictionary<any>;

  public readonly logger: Logger;
  public options: TraceoOptions;

  constructor(apiKey: string, options: Omit<TraceoOptions, "apiKey">) {
    super(apiKey, options);

    this.logger = new Logger();
  }

  public static get logger(): Logger {
    return this.logger;
  }

  public initSDK(): void {
    if (this.options.collectMetrics) {
      const metrics = new MetricsRunner();
      metrics.register();
    }
  }
}
