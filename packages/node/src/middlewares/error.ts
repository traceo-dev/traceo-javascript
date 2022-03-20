import { ErrorMiddlewareOptions, KlepperError, KlepperIncomingMessage } from "@klepper/transport";
import * as http from "http";
import { helpers } from "src/helpers";

/**
 * Base middleware to catch and intercept error across the app.
 * 
 * The simplest way to use it in Express.js and JavaScript:
 * 
 * @example
 * app.use(errorMiddleware())
 * 
 * Using Express.js with Typescript, middleware must be cast to express.ErrorRequestHandler.
 * 
 * @example
 * app.use(errorMiddleware() as express.ErrorRequestHandler)
 * 
 */
export const errorMiddleware = (options?: ErrorMiddlewareOptions) => {
    return function errorMiddleware(
        error: KlepperError,
        req: http.IncomingMessage,
        _res: http.ServerResponse,
        next: (error: Error) => void
    ): void {
        if (isToCatch(req, options)) {
            catchException(error);
        }

        next(error);
    }
}

/**
* 
* Check that the exceptions should be handled by Klepper
* 
* @param _options Object passed by client
* @param req Object of http.IncomingMessage to get request data
* @returns boolean
*/
const isToCatch = (req: KlepperIncomingMessage, options?: ErrorMiddlewareOptions): boolean => {

    if (!options?.allowHttp) {
        const isSecure = helpers.getProtocol(req);

        if (!isSecure) {
            return false;
        }
    }

    if (!options?.allowLocalhost) {
        const isLocalhost = helpers.isLocalhost(req);
        
        if (isLocalhost) {
            return false;
        }
    }

    return true;
}

/**
 * For using in middleware and as an function in try/catch
 * 
 * @example
 * } catch (error) {
 *     interceptException(error);
 * }
 * 
 * @param error 
 */
const catchException = (_error: KlepperError) => {
    //TO IMPLEMENT!
}