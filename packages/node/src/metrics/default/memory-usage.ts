import * as os from "os";
import { IMetrics, utils, MetricType, InstrumentType } from "@traceo-sdk/node-core";

export class MemoryUsageMetrics implements IMetrics {
  constructor() { }

  public collect(): MetricType {
    return [
      {
        descriptor: { name: "memory_usage_mb", type: InstrumentType.TIME_SERIES, unit: "mb", },
        dataPoints: [{ value: this.usedMemory }]
      },
      {
        descriptor: { name: "memory_usage_percentage", type: InstrumentType.TIME_SERIES, unit: "mb", },
        dataPoints: [{ value: this.percentageUsage }]
      }
    ];
  }

  private get percentageUsage() {
    return utils.toDecimalNumber((this.usedMemory / this.totalMemory) * 100);
  }

  private get usedMemory() {
    return Math.round(this.totalMemory - this.freeMemory);
  }

  private get freeMemory() {
    return Math.round(os.freemem() / 1024 / 1024);
  }

  private get totalMemory() {
    return Math.round(os.totalmem() / 1024 / 1024);
  }
}
