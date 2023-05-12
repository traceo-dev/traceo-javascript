import { utils, IMetrics, EventLoopMetricType, MetricType, InstrumentType, ValueType } from "@traceo-sdk/node-core";

let perf_hooks;
try {
  perf_hooks = require("perf_hooks");
} catch {
  console.warn(`[Traceo] Your NodeJS version is too old to user perf_hooks.`);
}

export class EventLoopMetrics implements IMetrics {
  //TODO: should be type here, but in different versions there are a different type,
  //eq. perf_hooks.IntervalHistogram
  histogram: any;

  constructor() {
    if (perf_hooks && perf_hooks.monitorEventLoopDelay) {
      this.histogram = perf_hooks.monitorEventLoopDelay({
        resolution: 10
      });
      this.histogram.enable();
    }
  }

  public collect(): MetricType {
    const metrics = ["loop_min", "loop_max", "loop_mean", "loop_stddev"];

    const data: EventLoopMetricType = {
      loop_min: utils.toDecimalNumber(this.histogram.min / 1e6),
      loop_max: utils.toDecimalNumber(this.histogram.max / 1e6),
      loop_mean: utils.toDecimalNumber(this.histogram.mean / 1e6),
      loop_stddev: utils.toDecimalNumber(this.histogram.stddev / 1e6)
    };
    this.histogram.reset();

    const response: MetricType = metrics.map((metric) => ({
      descriptor: {
        name: metric,
        type: InstrumentType.HISTOGRAM,
        valueType: ValueType.DOUBLE
      },
      dataPoints: [{ value: data[metric] }]
    }));

    return response;
  }
}
