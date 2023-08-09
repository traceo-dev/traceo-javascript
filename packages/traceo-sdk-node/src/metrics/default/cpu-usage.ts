import * as os from "os";
import {
  IMetrics,
  AverageCpuMetricType,
  utils,
  TraceoMetric,
  TraceoMetricType
} from "@traceo-sdk/node-core";

export class CpuUsageMetrics implements IMetrics {
  private measureStart: AverageCpuMetricType;

  constructor() {
    this.measureStart = this.calculateAverageCpuUsage();
  }

  public collect(): TraceoMetric[] {
    const endMeasure = this.calculateAverageCpuUsage();

    const idleDifference = endMeasure.idle - this.measureStart.idle;
    const totalDifference = endMeasure.total - this.measureStart.total;

    const cpuUsage = Math.round((100 - (100 * idleDifference) / totalDifference) * 100) / 100;

    return [
      {
        name: "cpu_usage",
        type: TraceoMetricType.GAUGE,
        unixTimestamp: utils.currentUnix(),
        value: cpuUsage
      }
    ];
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
