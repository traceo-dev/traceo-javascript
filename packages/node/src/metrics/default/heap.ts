import { IMetrics } from "../../types/interfaces/IMetrics";
import { toDecimalNumber } from "../../helpers";
import { HeapMetricType } from "../../types";

/**
 * https://www.geeksforgeeks.org/node-js-v8-getheapstatistics-method/
 *
 */
const TO_MB = 1024 * 1024;

export class HeapMetrics implements IMetrics<HeapMetricType> {
  constructor() {}

  collect(): HeapMetricType {
    return {
      heap_used: this.usedHeap,
      heap_total: this.totalHeap,
      heap_rss: this.rss
      // heap_detached_contexts: this.detachedContextsNumber,
      // heap_native_contexts: this.nativeContextsNumber,
    };
  }

  private get usedHeap() {
    return toDecimalNumber(process.memoryUsage().heapUsed / TO_MB);
  }

  private get totalHeap() {
    return toDecimalNumber(process.memoryUsage().heapTotal / TO_MB);
  }

  private get rss() {
    return toDecimalNumber(process.memoryUsage().rss / TO_MB);
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
