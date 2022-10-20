import * as perf_hooks from "perf_hooks";
import { Metrics } from "../../transport/metrics";
import { toDecimalNumber } from "../helpers";

const histogram = perf_hooks.monitorEventLoopDelay({
  resolution: 10,
});
histogram.enable();

const collect = () => {
  const data: Metrics["eventLoopLag"] = {
    min: toDecimalNumber(histogram.min / 1e6),
    max: toDecimalNumber(histogram.max / 1e6),
    mean: toDecimalNumber(histogram.mean / 1e6),
    stddev: toDecimalNumber(histogram.stddev / 1e6),
    p50: toDecimalNumber(histogram.percentile(50) / 1e6),
    p90: toDecimalNumber(histogram.percentile(90) / 1e6),
    p99: toDecimalNumber(histogram.percentile(99) / 1e6),
  };
  histogram.reset();

  return data;
};

export const eventLoop = { collect };
