import { global } from "../core";
import { KlepperOptions } from "../transport";

const defaultConnectCallback = () => true;

/**
 * 
 * Function to connect client with Klepper App.
 * 
 * @param options Base client options to set to launch app
 * @param callback default return true, if return false then connection to Klepper has not been established
 * 
 * @example
 * Klepper.connect({ credentials: { apiKey: "", secretKey: "" } }, () => {
 *   if (process.env.ENV === "prod") {
 *      return true;
 *  }
 *   return false;
 * })
 */
export const connect = (options: KlepperOptions, callback = defaultConnectCallback): void => {
    const client = global.getGlobalClientData();

    if (!callback) {
        console.warn(`[KLEPPER]: Due to a callback setting for the connect function, the attempt to establish a connection has failed.`)
    }

    if (!client) {
        global.setGlobalClientData({ privateKey: options.privateKey })
    }
}
