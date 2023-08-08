import {
  TraceoError,
  TraceoIncomingMessage,
  TraceoServerResponse,
  ErrorMiddlewareOptions,
  utils
} from "@traceo-sdk/node-core";
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
    if (!utils.isClientConnected()) {
      next(error);
      return;
    }

    if (isToCatch(req, options)) {
      await catchException(error);
    }

    next(error);
  };
};

const isToCatch = (req: TraceoIncomingMessage, options: ErrorMiddlewareOptions = {}): boolean => {
  if (options.allowHttp !== undefined && !options.allowHttp) {
    const isSecure = utils.getProtocol(req) === "https" ? true : false;
    if (!isSecure) {
      return false;
    }
  }

  if (options.allowLocalhost !== undefined && !options.allowLocalhost) {
    const ip = utils.getIp(req) as string;
    if (utils.isLocalhost(ip)) {
      return false;
    }
  }

  return true;
};
