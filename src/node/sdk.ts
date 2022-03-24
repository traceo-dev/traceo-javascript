import { setGlobalClientData } from "../core/global";
import { isClientConnected } from "../core/is";
import { KlepperOptions } from "../transport/options";

export const defaultBooleanCallback = () => true;

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
 * Klepper.connect({ credentials: { privateKey: "" } }, () => {
 *   if (process.env.ENV === "prod") {
 *      return true;
 *  }
 *   return false;
 * })
 * ```
 */
export const connect = (
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
    setGlobalClientData({ privateKey: options.privateKey });
  }
};
