import * as v8 from "v8";

/**
 * https://www.geeksforgeeks.org/node-js-v8-getheapstatistics-method/
 *
 */
const getHeapStatistics = () => v8.getHeapStatistics();

const getUsedHeapSize = () => getHeapStatistics().used_heap_size;

const getNumberOfNativeContexts = () =>
  getHeapStatistics().number_of_native_contexts;

const getNumberOfDetachedContexts = () =>
  getHeapStatistics().number_of_detached_contexts;

export const v8Metrics = {
  usedHeapSize: getUsedHeapSize(),
  numberOfNativeContexts: getNumberOfNativeContexts(),
  numberOfDetachedContexts: getNumberOfDetachedContexts(),
};
