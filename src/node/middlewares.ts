import { sendEvent } from "../core/http";
import { isClientConnected, isLocalhost } from "../core/is";
import { TraceoError } from "../transport/base";
import { TraceoEvent } from "../transport/events";
import {
  TraceoIncomingMessage,
  TraceoServerResponse,
} from "../transport/http";
import {
  CatchExceptionsOptions,
  ErrorMiddlewareOptions,
} from "../transport/options";
import { getIp, getProtocol } from "./helpers";
import { prepareException } from "./parse";

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
  return async function errorMiddleware(
    error: TraceoError,
    req: TraceoIncomingMessage,
    _res: TraceoServerResponse,
    next: (error: TraceoError) => void
  ): Promise<void> {
    if (!isClientConnected()) {
      next(error);
      return;
    }

    if (isToCatch(req, options)) {
      await handleException(error, req);
    }

    next(error);
  };
};

const isToCatch = (
  req: TraceoIncomingMessage,
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
  // options?: CatchExceptionsOptions;
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
    await handleException(error, undefined);
  }

  return;
};

const handleException = async (
  error: TraceoError,
  req?: TraceoIncomingMessage,
  options?: CatchExceptionsOptions
) => {
  try {
    const event: TraceoEvent = await prepareException(error, options, req);
    await sendEvent(event);
  } catch (err) {
    //
  }
};

export const Middleware = {
  errorMiddleware,
};
