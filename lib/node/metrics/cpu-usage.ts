import * as os from "node:os";
import { IMetrics } from "../../core/interfaces/IMetrics";

type AverageCpuMetricType = {
  idle: number;
  total: number;
};
export class CpuUsageMetrics implements IMetrics<number> {
  measureStart: AverageCpuMetricType;

  constructor() {
    this.measureStart = this.calculateAverageCpuUsage();
  }

  collect(): number {
    const endMeasure = this.calculateAverageCpuUsage();

    const idleDifference = endMeasure.idle - this.measureStart.idle;
    const totalDifference = endMeasure.total - this.measureStart.total;

    const cpuUsage =
      Math.round((100 - (100 * idleDifference) / totalDifference) * 100) / 100;

    return cpuUsage;
  }

  private calculateAverageCpuUsage(): AverageCpuMetricType {
    const cpus = os.cpus();

    let totalIdle: number = 0;
    let totalTick: number = 0;

    for (let i = 0, len = cpus.length; i < len; i++) {
      const cpu = cpus[i];
      for (const type in cpu.times) {
        totalTick += cpu.times[type];
      }

      totalIdle += cpu.times.idle;
    }

    return { idle: totalIdle / cpus.length, total: totalTick / cpus.length };
  }
}
