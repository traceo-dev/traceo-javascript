import { Metrics } from ".";
import { IMeauserement } from "../../core/interfaces/metrics";

export class Meauserement implements IMeauserement {
  private field: Record<string, number[]>;

  constructor(metrics: Metrics) {
    this.field = metrics.clientMeauserementMetrics;

    if (!this.field) {
      this.field = {};
    }
  }

  public add(key: string, val: number): this {
    if (!this.field[key]) {
      this.field[key] = [];
    }
    this.field[key].push(val);

    return this;
  }

  public clear(key: string): this {
    this.field[key] = [];

    return this;
  }
}
