import * as v8 from "v8";
import { IMetrics } from "../../core/interfaces/IMetrics";
import { toDecimalNumber } from "../helpers";

/**
 * https://www.geeksforgeeks.org/node-js-v8-getheapstatistics-method/
 *
 */
const TO_MB = 1024 * 1024;

type HeapMetricType = {
  used: number;
  total: number;
  rss: number;
  nativeContexts: number;
  detachedContexts: number;
};

export class HeapMetrics implements IMetrics<HeapMetricType> {
  constructor() {}

  collect(): HeapMetricType {
    return {
      used: this.usedHeap,
      total: this.totalHeap,
      rss: this.rss,
      detachedContexts: this.detachedContextsNumber,
      nativeContexts: this.nativeContextsNumber,
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

  private get detachedContextsNumber() {
    return this.heapStatistics.number_of_detached_contexts;
  }

  private get nativeContextsNumber() {
    return this.heapStatistics.number_of_native_contexts;
  }

  private get heapStatistics() {
    return v8.getHeapStatistics();
  }
}
