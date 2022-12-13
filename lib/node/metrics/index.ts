import { IClientMetrics, ICounter } from "../../core/interfaces/metrics";
import { Counter } from "./counter";
import { MetricsRunner } from "./runner";

export class Metrics extends MetricsRunner implements IClientMetrics {
  private _counter: Counter;

  constructor() {
    super();

    this._counter = new Counter(this);
  }

  public counter(): ICounter {
    return this._counter;
  }
}
