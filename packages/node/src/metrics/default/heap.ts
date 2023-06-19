import { utils, IMetrics, MetricType, InstrumentType, DataPointType } from "@traceo-sdk/node-core";

/**
 * https://www.geeksforgeeks.org/node-js-v8-getheapstatistics-method/
 *
 */
const TO_MB = 1024 * 1024;

export class HeapMetrics implements IMetrics {
  constructor() { }

  collect(): MetricType {
    return [
      {
        descriptor: { name: "heap_used", type: InstrumentType.TIME_SERIES },
        dataPointType: DataPointType.TIME_SERIES,
        dataPoints: [{ value: this.usedHeap, startTime: [utils.currentUnix()] }]
      },
      {
        descriptor: { name: "heap_total", type: InstrumentType.TIME_SERIES },
        dataPointType: DataPointType.TIME_SERIES,
        dataPoints: [{ value: this.totalHeap, startTime: [utils.currentUnix()] }]
      },
      {
        descriptor: { name: "heap_rss", type: InstrumentType.TIME_SERIES },
        dataPointType: DataPointType.TIME_SERIES,
        dataPoints: [{ value: this.rss, startTime: [utils.currentUnix()] }]
      },
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
