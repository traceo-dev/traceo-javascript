import { EventLoopMetricType } from "src/types";
import { toDecimalNumber } from "../../helpers";
import { IMetrics } from "../../types/interfaces/IMetrics";

let perf_hooks;
try {
  perf_hooks = require("perf_hooks");
} catch {
  console.warn(`[Traceo] Yoour Node.JS version is too old to user perf_hooks.`);
}

export class EventLoopMetrics implements IMetrics<EventLoopMetricType> {
  //TODO: should be type here, but in different versions there are a different type,
  //eq. perf_hooks.IntervalHistogram
  histogram: any;

  constructor() {
    if (perf_hooks && perf_hooks.monitorEventLoopDelay) {
      this.histogram = perf_hooks.monitorEventLoopDelay({
        resolution: 10,
      });
      this.histogram.enable();
    }
  }

  public collect(): EventLoopMetricType {
    const data: EventLoopMetricType = {
      loop_min: toDecimalNumber(this.histogram.min / 1e6),
      loop_max: toDecimalNumber(this.histogram.max / 1e6),
      loop_mean: toDecimalNumber(this.histogram.mean / 1e6),
      loop_stddev: toDecimalNumber(this.histogram.stddev / 1e6),
    };
    this.histogram.reset();

    return data;
  }
}
