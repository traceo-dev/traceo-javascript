import { IClientMetrics, ICounter, IGauge, IMeauserement, ITimeSeries } from "../../core/interfaces/metrics";
import { Counter } from "./counter";
import { Gauge } from "./gauge";
import { Meauserement } from "./meauserement";
import { MetricsRunner } from "./runner";
import { TimeSeries } from "./time-series";

export class Metrics extends MetricsRunner implements IClientMetrics {
  private _counter: Counter;
  private _meauserement: Meauserement;
  private _gauge: Gauge;
  private _timeSeries: TimeSeries;

  constructor() {
    super();

    this._counter = new Counter(this);
    this._meauserement = new Meauserement(this);
    this._gauge = new Gauge(this);
    this._timeSeries = new TimeSeries(this);
  }

  public counter(): ICounter {
    return this._counter;
  }

  public meauserement(): IMeauserement {
    return this._meauserement;
  }

  public gauge(): IGauge {
    return this._gauge;
  }

  public timeSeries(): ITimeSeries {
    return this._timeSeries;
  }
}
