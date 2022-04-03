import { getGlobalClientData } from "../core/global";
import { sendEvent } from "../core/http";
import { isClientConnected, isLocalhost } from "../core/is";
import { KlepperError } from "../transport/base";
import { CatchType } from "../transport/enums";
import { KlepperEvent } from "../transport/events";
import {
  KlepperIncomingMessage,
  KlepperServerResponse,
} from "../transport/http";
import {
  CatchExceptionsOptions,
  ErrorMiddlewareOptions,
} from "../transport/options";
import { getIp, getProtocol, mapRequestData } from "./helpers";

/**
 * Base middleware to catch and intercept error across the express app.
 * This middleware catch errors only from the no-async methods.
 *
 * To catch errors from async functions, we suggest to use `catchException` instead.
 *
 * The simplest way to use it in Express.js and JavaScript:
 *
 * @example
 * ```
 *
 * app.use(Middleware.errorMiddleware());
 * ```
 *
 * Using Express.js with Typescript, middleware must be cast to express.ErrorRequestHandler.
 *
 * @example
 * ```
 *
 * app.use(Middleware.errorMiddleware() as express.ErrorRequestHandler);
 * ```
 *
 */
const errorMiddleware = (options: ErrorMiddlewareOptions = {}) => {
  return function errorMiddleware(
    error: KlepperError,
    req: KlepperIncomingMessage,
    _res: KlepperServerResponse,
    next: (error: KlepperError) => void
  ): void {
    if (!isClientConnected()) {
      next(error);
      return;
    }

    if (isToCatch(req, options)) {
      handleException(error, req);
    }

    next(error);
  };
};

const isToCatch = (
  req: KlepperIncomingMessage,
  options: ErrorMiddlewareOptions = {}
): boolean => {
  if (options.allowHttp !== undefined && !options.allowHttp) {
    const isSecure = getProtocol(req) === "https" ? true : false;
    if (!isSecure) {
      return false;
    }
  }

  if (options.allowLocalhost !== undefined && !options.allowLocalhost) {
    if (isLocalhost(String(getIp(req)))) {
      return false;
    }
  }

  return true;
};

interface Catch {
  options?: CatchExceptionsOptions;
  shouldBeCatched?: (error: any) => boolean;
}

/**
 * For using in middleware and as an function in try/catch
 *
 * Base usage:
 * @example
 *
 * ```
 * } catch (error) {
 *     catchException(error);
 * }
 * ```
 *
 * Usage with optional parameter `shouldBeCatched` as a callback function:
 * @example
 *
 * ```
 * catchException(error, {
 *   shouldBeCatched: () => {
 *     return true;
 *   }
 * });
 * ```
 *
 */
export const catchException = async (error: any, catchOptions?: Catch) => {
  if (catchOptions?.shouldBeCatched !== undefined) {
    if (!catchOptions?.shouldBeCatched(error)) {
      return;
    }
  }

  if (isClientConnected()) {
    await handleException(error, undefined, catchOptions?.options);
  }

  return;
};

const handleException = async (
  error: KlepperError,
  req?: KlepperIncomingMessage,
  options?: CatchExceptionsOptions
) => {
  const { message, name } = error;

  const event: KlepperEvent = {
    date: Date.now(),
    type: name,
    message,
    stack: error.stack as string,
    catchType: req ? CatchType.MIDDLEWARE : CatchType.INTERNAL,
    options,
  };

  if (req !== undefined) {
    event.requestData = mapRequestData(req);
  }

  await sendEvent(event);
};

export const Middleware = {
  errorMiddleware,
};
