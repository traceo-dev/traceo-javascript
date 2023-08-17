import { utils, IMetrics, TraceoMetric, TraceoMetricType } from "@traceo-sdk/node-core";

/**
 * https://www.geeksforgeeks.org/node-js-v8-getheapstatistics-method/
 *
 */
const TO_MB = 1024 * 1024;

export class HeapMetrics implements IMetrics {
  constructor() {}

  collect(): TraceoMetric[] {
    return [
      {
        name: "heap_used",
        type: TraceoMetricType.GAUGE,
        unixTimestamp: utils.currentUnix(),
        value: this.usedHeap
      },
      {
        name: "heap_total",
        type: TraceoMetricType.GAUGE,
        unixTimestamp: utils.currentUnix(),
        value: this.totalHeap
      },
      {
        name: "heap_rss",
        type: TraceoMetricType.GAUGE,
        unixTimestamp: utils.currentUnix(),
        value: this.rss
      }
    ];
  }

  private get usedHeap() {
    return utils.toDecimalNumber(process.memoryUsage().heapUsed / TO_MB);
  }

  private get totalHeap() {
    return utils.toDecimalNumber(process.memoryUsage().heapTotal / TO_MB);
  }

  private get rss() {
    return utils.toDecimalNumber(process.memoryUsage().rss / TO_MB);
  }

  // private get detachedContextsNumber() {
  //   return this.heapStatistics.number_of_detached_contexts;
  // }

  // private get nativeContextsNumber() {
  //   return this.heapStatistics.number_of_native_contexts;
  // }

  // private get heapStatistics() {
  //   return v8.getHeapStatistics();
  // }
}
