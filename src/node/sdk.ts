import { setGlobalClientData } from "../core/global";
import { sendConnection } from "../core/http";
import { isClientConnected } from "../core/is";
import { KlepperReleaseEvent } from "../transport/events";
import { KlepperOptions } from "../transport/options";
import * as os from "os";

const defaultBooleanCallback = () => true;

/**
 *
 * Function to connect client with Klepper App.
 *
 * @param options Base client options to set to launch app
 * @param callback default return true, if return false then connection to Klepper has not been established
 *
 * @example
 *
 * ```
 * Klepper.connect({ /credentials/, () => {
 *   if (process.env.ENV === "prod") {
 *      return true;
 *  }
 *   return false;
 * })
 * ```
 */
export const init = (
  options: KlepperOptions,
  callback = defaultBooleanCallback
): void => {
  /**
   * TODO:
   *
   * check if @options > @projectId is existing in Klepper db
   */

  if (!callback) {
    console.warn(
      `[KLEPPER]: Due to a callback setting for the connect function, the attempt to establish a connection has failed.`
    );
  }

  if (!isClientConnected()) {
    setGlobalClientData({
      privateKey: options?.privateKey,
      appId: options?.appId,
      environment: options?.environment,
      version: options?.version,
    });
  }

  const conn: KlepperReleaseEvent = {
    env: options?.environment,
    version: options?.version,
    os: {
      arch: os.arch(),    
      platform: os.platform(),
      release: os.release(),
      version: os.version(),
    }
  };

  sendConnection(conn);
};
