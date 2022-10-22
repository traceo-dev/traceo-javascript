import { HttpModule } from "../core/http";
import { Metrics } from "../transport/metrics";
import { TraceoOptions } from "../transport/options";
import { toDecimalNumber } from "./helpers";
import { CpuUsageMetrics } from "./metrics/cpu-usage";
import { EventLoopMetrics } from "./metrics/event-loop";
import { HeapMetrics } from "./metrics/heap";
import { MemoryUsageMetrics } from "./metrics/memory-usage";
import * as os from "os";

const DEFAULT_INTERVAL = 30; //seconds

export class MetricsProbe {
  private readonly interval: number;

  private readonly http: HttpModule;

  private readonly cpuUsage: CpuUsageMetrics;
  private readonly eventLoop: EventLoopMetrics;
  private readonly heap: HeapMetrics;
  private readonly memoryUsage: MemoryUsageMetrics;

  constructor(options: TraceoOptions) {
    if (!options.metrics.collect) {
      return;
    }

    this.interval = options.metrics.interval || DEFAULT_INTERVAL;

    this.http = new HttpModule("/api/worker/metrics");

    this.cpuUsage = new CpuUsageMetrics();
    this.eventLoop = new EventLoopMetrics();
    this.heap = new HeapMetrics();
    this.memoryUsage = new MemoryUsageMetrics();
  }

  public register() {
    setInterval(() => this.collectMetrics(), this.interval * 1000);
  }

  private collectMetrics() {
    const cpuUsage = this.cpuUsage.collect();
    const eventLoop = this.eventLoop.collect();
    const heap = this.heap.collect();
    const memory = this.memoryUsage.collect();

    const metrics: Partial<Metrics> = {
      cpuUsage,
      eventLoopLag: eventLoop,
      heap,
      memory,
      loadAvg: this.loadAvg,
    };

    this.http.request({
      body: metrics,
      onError: (error: Error) => {
        console.error(
          `Traceo Error. Something went wrong while sending new Log to Traceo. Please report this issue.`
        );
        console.error(`Caused by: ${error.message}`);
      },
    });
  }

  private get loadAvg() {
    return toDecimalNumber(os.loadavg()[0]);
  }
}
