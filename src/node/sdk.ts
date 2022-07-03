import { setGlobalClientData } from "../core/global";
import { sendConnection } from "../core/http";
import { isClientConnected } from "../core/is";
import { TraceoReleaseEvent } from "../transport/events";
import { TraceoOptions } from "../transport/options";
import { getOsPlatform } from "./helpers";

/**
 *
 * Function to connect client with Traceo App.
 *
 * @param options
 *
 */
export const init = (
  options: TraceoOptions
): void => {
  if (!isClientConnected()) {
    setGlobalClientData({
      ...options
    });
  }

  const conn: TraceoReleaseEvent = {
    env: options?.environment,
    version: options?.version,
    os: getOsPlatform(),
  };

  sendConnection(conn);
};
