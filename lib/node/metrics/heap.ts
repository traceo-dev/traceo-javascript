import * as v8 from "v8";

/**
 * https://www.geeksforgeeks.org/node-js-v8-getheapstatistics-method/
 *
 */
const TO_MB = 1024 * 1024;

const getHeapStatistics = () => v8.getHeapStatistics();

const getNumberOfNativeContexts = () =>
  getHeapStatistics().number_of_native_contexts;

const getNumberOfDetachedContexts = () =>
  getHeapStatistics().number_of_detached_contexts;

export const heap = {
  used: Number((process.memoryUsage().heapUsed / TO_MB).toFixed(2)),
  total: Number((process.memoryUsage().heapTotal / TO_MB).toFixed(2)),
  rss: Number((process.memoryUsage().rss / TO_MB).toFixed(2)),
  nativeContexts: getNumberOfNativeContexts(),
  detachedContexts: getNumberOfDetachedContexts(),
};
