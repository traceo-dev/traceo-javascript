import * as v8 from "v8";
import { Metrics } from "../../transport/metrics";
import { toDecimalNumber } from "../helpers";

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

export const heap: Metrics['heap'] = {
  used: toDecimalNumber(process.memoryUsage().heapUsed / TO_MB),
  total: toDecimalNumber(process.memoryUsage().heapTotal / TO_MB),
  rss: toDecimalNumber(process.memoryUsage().rss / TO_MB),
  nativeContexts: getNumberOfNativeContexts(),
  detachedContexts: getNumberOfDetachedContexts(),
};
