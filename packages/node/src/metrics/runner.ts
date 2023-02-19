import { Client } from "../client";
import { CpuUsageMetrics } from "./default/cpu-usage";
import { EventLoopMetrics } from "./default/event-loop";
import { HeapMetrics } from "./default/heap";
import { MemoryUsageMetrics } from "./default/memory-usage";

import { toDecimalNumber } from "../helpers";
import * as os from "os";
import { HttpModule } from "../core/http";
import { DefaultMetrics, Metrics } from "src/types";

/**
 * Runner for metrics collecting
 */

const DEFAULT_INTERVAL = 30; //seconds

export class MetricsRunner {
  private client: Client;

  private readonly interval: number;
  private readonly http: HttpModule;

  private readonly cpuUsage: CpuUsageMetrics;
  private readonly eventLoop: EventLoopMetrics;
  private readonly heap: HeapMetrics;
  private readonly memoryUsage: MemoryUsageMetrics;

  public clientCounterMetrics: Record<string, number>;
  public clientGaugeMetrics: Record<string, number>;
  public clientTimeSeriesMetrics: Record<string, number>;
  public clientMeauserementMetrics: Record<string, number[]>;

  constructor() {
    this.client = global["__TRACEO__"];

    if (!this.client.options.collectMetrics) {
      return;
    }

    this.interval =
      this.client.options.scrapMetricsInterval || DEFAULT_INTERVAL;

    this.http = HttpModule.getInstance();

    this.cpuUsage = new CpuUsageMetrics();
    this.eventLoop = new EventLoopMetrics();
    this.heap = new HeapMetrics();
    this.memoryUsage = new MemoryUsageMetrics();

    this.clientCounterMetrics = {};
    this.clientMeauserementMetrics = {};
    this.clientGaugeMetrics = {};
    this.clientTimeSeriesMetrics = {};
  }

  public register(): void {
    setInterval(() => this.collectMetrics(), this.interval * 1000);
  }

  private clearClientMetrics(): void {
    this.clientCounterMetrics = {};
    this.clientMeauserementMetrics = {};
    this.clientGaugeMetrics = {};
    this.clientTimeSeriesMetrics = {};
  }

  private collectDefaultMetrics(): Partial<Metrics> {
    const cpuUsage = this.cpuUsage.collect();
    const eventLoop = this.eventLoop.collect();
    const heap = this.heap.collect();
    const memory = this.memoryUsage.collect();

    const metrics: DefaultMetrics = {
      cpu_usage: cpuUsage,
      load_avg: this.loadAvg,
      ...memory,
      ...heap,
      ...eventLoop,
    };

    return metrics;
  }

  private collectMetrics(): void {
    const defaultMetrics = this.collectDefaultMetrics();

    const metrics = {
      default: defaultMetrics,
      counter: this.clientCounterMetrics,
      meauserement: this.clientMeauserementMetrics,
      gauge: this.clientGaugeMetrics,
      timeSeries: this.clientTimeSeriesMetrics,
    };

    this.http.request({
      url: "/api/worker/metrics",
      body: metrics,
      onError: (error: Error) => {
        console.error(
          `Traceo Error. Something went wrong while sending new Log to Traceo. Please report this issue.`
        );
        console.error(`Caused by: ${error.message}`);
      },
      callback: () => {
        this.clearClientMetrics();
      }
    });
  }

  private get loadAvg(): number {
    return toDecimalNumber(os.loadavg()[0]);
  }
}
