import * as os from "node:os";
import { IMetrics } from "../../core/interfaces/IMetrics";
import { toDecimalNumber } from "../helpers";

type MemoryUsageMetricType = {
  mb: number;
  percentage: number;
};
export class MemoryUsageMetrics implements IMetrics<MemoryUsageMetricType> {
  constructor() {}

  collect(): MemoryUsageMetricType {
    return {
      mb: this.usedMemory,
      percentage: this.percentageUsage,
    };
  }

  private get percentageUsage() {
    return toDecimalNumber((this.usedMemory / this.totalMemory) * 100);
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
