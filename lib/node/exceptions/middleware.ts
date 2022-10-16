import { isClientConnected, isLocalhost } from "../../core/is";
import { TraceoError } from "../../transport/base";
import {
  TraceoIncomingMessage,
  TraceoServerResponse,
} from "../../transport/http";
import { ErrorMiddlewareOptions } from "../../transport/options";
import { getProtocol, getIp } from "../helpers";
import { catchException } from "./handler";
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
export const errorMiddleware = (options: ErrorMiddlewareOptions = {}) => {
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
      await catchException(error);
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
