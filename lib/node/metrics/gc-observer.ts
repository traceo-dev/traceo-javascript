import { IMetrics } from "../../core/interfaces/IMetrics";
import * as perf_hooks from "node:perf_hooks";
import { toDecimalNumber } from "../helpers";

type GCObserverType = {
  duration: {
    total: number;
    average: number;
  };
};

export class GCObserver implements IMetrics<GCObserverType> {
  private gcDurations: number[] = [];

  // private GC_MAJOR: number = 0;
  // private GC_MINOR: number = 0;
  // private GC_INCREMENTAL: number = 0;
  // private GC_WEAKCB: number = 0;

  constructor() {
    const obs = new perf_hooks.PerformanceObserver((list) => {
      const entry = list.getEntries()[0];
      // const kind = !entry.detail ? entry["kind"] : entry.detail["kind"];

      this.gcDurations.push(entry.duration);
    });
    obs.observe({ entryTypes: ["gc"] });
  }

  collect(): GCObserverType {
    const total = this.gcDurations.reduce((prev, curr) => prev + curr, 0);
    const average = total / this.gcDurations.length;

    this.gcDurations = [];

    return {
      duration: {
        total: toDecimalNumber(total),
        average: toDecimalNumber(average),
      },
    };
  }
}
