import { Metrics } from ".";
import { ICounter } from "../../core/interfaces/metrics";

export class Counter implements ICounter {
  private metrics: Metrics;

  constructor(runner: Metrics) {
    this.metrics = runner;
  }

  public increment(key: string, val: number = 1): this {
    if (!this.metrics.clientMetrics[key]) {
      this.metrics.clientMetrics[key] = 0;
    }
    this.metrics.clientMetrics[key] += val;

    return this;
  }

  public decrement(key: string, val: number = 1): this {
    if (!this.metrics.clientMetrics[key]) {
      this.metrics.clientMetrics[key] = 0;
    }
    this.metrics.clientMetrics[key] -= val;

    return this;
  }

  public reset(key: string): this {
    this.metrics.clientMetrics[key] = 0;

    return this;
  }
}
