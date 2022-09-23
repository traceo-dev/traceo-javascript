import { setGlobalClientData } from "../core/global";
import { isClientConnected } from "../core/is";
import { TraceoOptions } from "../transport/options";
import { metrics } from "./metrics";

/**
 *
 * Function to connect client with Traceo.
 *
 * @param options
 *
 */
export const init = (options: TraceoOptions): void => {
  if (options?.offline) {
    //SDK is not initialized
    return;
  }

  if (!options.environment) {
    console.warn(
      "Traceo SDK: Empty environment property. Please set current env or use offline mode."
    );
    return;
  }

  if (!isClientConnected()) {
    setGlobalClientData({
      ...options,
    });
  }

  metrics.collectMetricsDataOnRuntime();
};

export const collectMetricsData = () => {};
