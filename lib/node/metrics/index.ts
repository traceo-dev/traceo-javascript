import { IClientMetrics } from "../../core/interfaces/metrics";
import { MetricsRunner } from "./runner";

export class Metrics extends MetricsRunner implements IClientMetrics {
  constructor() {
    super();
  }

  public increment(key: string, val: number = 1): IClientMetrics {
    if (!this.clientMetrics[key]) {
      this.clientMetrics[key] = 0;
    }
    this.clientMetrics[key] += val;

    return this;
  }

  public decrement(key: string, val: number = 1): IClientMetrics {
    if (!this.clientMetrics[key]) {
      this.clientMetrics[key] = 0;
    }
    this.clientMetrics[key] -= val;

    return this;
  }
}
