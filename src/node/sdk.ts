import { setGlobalClientData } from "../core/global";
import { sendRelease } from "../core/http";
import { isClientConnected } from "../core/is";
import { TraceoReleaseEvent } from "../transport/events";
import { TraceoOptions } from "../transport/options";
import { getOsPlatform } from "./helpers";

/**
 *
 * Function to connect client with Traceo Instance.
 *
 * @param options
 *
 */
export const init = (options: TraceoOptions): void => {
  if (options?.offline) {
    //SDK is not initialized
    return;
  }

  if (!isClientConnected()) {
    setGlobalClientData({
      ...options,
    });
  }

  const conn: TraceoReleaseEvent = {
    env: options?.environment,
    version: options?.version,
    os: getOsPlatform(),
  };

  sendRelease(conn);
};
