import { CpuUsageMetrics } from "./default/cpu-usage";
import { EventLoopMetrics } from "./default/event-loop";
import { HeapMetrics } from "./default/heap";
import { MemoryUsageMetrics } from "./default/memory-usage";
import { transport, CAPTURE_ENDPOINT, utils, MetricType, InstrumentType, ValueType, INodeClient } from "@traceo-sdk/node-core";
import * as os from "os";

/**
 * Runner for metrics collecting
 */

const DEFAULT_INTERVAL = 15000; //ms -> 15s

export class MetricsRunner {
  private client: INodeClient;

  private readonly interval: number;

  private readonly cpuUsage: CpuUsageMetrics;
  private readonly eventLoop: EventLoopMetrics;
  private readonly heap: HeapMetrics;
  private readonly memoryUsage: MemoryUsageMetrics;

  public clientCounterMetrics: Record<string, number>;
  public clientGaugeMetrics: Record<string, number>;
  public clientTimeSeriesMetrics: Record<string, number>;
  public clientMeauserementMetrics: Record<string, number[]>;

  constructor() {
    this.client = utils.getGlobalTraceo();

    if (!this.client.options.collectMetrics) {
      return;
    }

    this.interval = this.client.options.exportIntervalMillis || DEFAULT_INTERVAL;

    this.cpuUsage = new CpuUsageMetrics();
    this.eventLoop = new EventLoopMetrics();
    this.heap = new HeapMetrics();
    this.memoryUsage = new MemoryUsageMetrics();
  }

  public register(): void {
    setInterval(() => this.collectMetrics(), this.interval * 1000);
  }

  private collectMetrics(): void {
    const cpuUsage = this.cpuUsage.collect();
    const eventLoop = this.eventLoop.collect();
    const heap = this.heap.collect();
    const memory = this.memoryUsage.collect();

    const metrics: MetricType = [
      ...cpuUsage,
      ...eventLoop,
      ...heap,
      ...memory,
      ...this.loadAvg
    ];


    transport.request({
      url: CAPTURE_ENDPOINT.METRICS,
      body: metrics,
      onError: (error: Error) => {
        console.error(
          `Traceo Error. Something went wrong while sending new Log to Traceo. Please report this issue.`
        );
        console.error(`Caused by: ${error.message}`);
      }
    });
  }

  private get loadAvg(): MetricType {
    const load = utils.toDecimalNumber(os.loadavg()[0]);

    return [{
      descriptor: {
        name: "load_avg",
        type: InstrumentType.OBSERVABLE_GAUGE,
        valueType: ValueType.DOUBLE
      },
      dataPoints: [{ value: load }]
    }]
  }
}
