import { Metrics } from ".";
import { ICounter } from "../../core/interfaces/metrics";

export class Counter implements ICounter {
  private field: Record<string, number>;

  constructor(metrics: Metrics) {
    this.field = metrics.clientCounterMetrics;

    if (!this.field) {
      this.field = {};
    }
  }

  public increment(key: string, val: number = 1): this {
    if (!this.field[key]) {
      this.field[key] = 0;
    }
    this.field[key] += val;

    return this;
  }

  public decrement(key: string, val: number = 1): this {
    if (!this.field[key]) {
      this.field[key] = 0;
    }
    this.field[key] -= val;

    return this;
  }

  public reset(key: string): this {
    this.field[key] = 0;

    return this;
  }
}
