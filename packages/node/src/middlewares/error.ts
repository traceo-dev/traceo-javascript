import { ErrorMiddlewareOptions, KlepperError, KlepperEvent, KlepperIncomingMessage, KlepperServerResponse, RequestPayload } from "@klepper/transport";
import { helpers } from "src/helpers";
import { http } from "@klepper/commons";

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
        req: KlepperIncomingMessage,
        _res: KlepperServerResponse,
        next: (error: Error) => void
    ): void {
        if (isToCatch(req, options)) {
            catchException(error, req);
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
export const catchException = (error: KlepperError, req: KlepperIncomingMessage) => {
    const { message, name } = error;

    try {
        // const traces = helpers.prepareStackTraces(parse(error));
        const request = helpers.mapRequestData(req);

        const event: KlepperEvent = {
            date: new Date().getDate(),
            requestData: request,
            type: name,
            message,
            stack: error.stack as string
        };

        const payload: RequestPayload = {
            data: event,
        }

        http.sendEvent(payload);
    } catch (error) {
        console.warn(`[Klepper] Cannot catch exception: ${error}`);
    }
}
