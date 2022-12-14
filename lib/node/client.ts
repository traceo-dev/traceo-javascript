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

// const client = new Client({ apiKey: "", appId: "", url: "" });

// Gauge metric save last provided value in last time period
// Standardowy Gauge z echarts
// client
//   .metrics()
//   .gauge()
//   .set("db-size", 15)
//   .set("db-size", 5); //save only 5

// Counter metric save value incemented/decremented in last time period
// Wykres: histogram -> kolumnowy
// client
//   .metrics()
//   .counter()
//   .increment("auth-count")
//   .increment("auth-count", 5)
//   .decrement("auth-count", 3); //save auth-count with value 3 (1 + 5 - 3);

// Meauserement metric save count, mean, 90th percentile and 95th percentile of the metric at this time
// Wykres: łączony -> kolumny określające count oraz linia określająca mean (co z percentylami?)
// client
//   .metrics()
//   .meauserement()
//   .add("mem-usage", 110)
//   .add("mem-usage", 100)
//   .add("mem-usage", 50) //save 3 as count, 86.6 as mean + percentiles (?)

// Time series metric save sum of all added values correlated with time
// Wykres: standardowy do customizacji
// client
//   .metrics()
//   .timeSeries()
//   .add("cpu-usage", 55)
//   .add("cpu-usage", 45)
//   .add("cpu-usage", 35); //save 135 as a sum
  