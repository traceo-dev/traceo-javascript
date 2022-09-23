import { stacktrace } from "stacktrace-parser-node";
import { sendEvent, sendIncidentEvent } from "../core/http";
import { isClientConnected, isLocalhost } from "../core/is";
import { TraceoError } from "../transport/base";
import { Incident } from "../transport/events";
import { TraceoIncomingMessage, TraceoServerResponse } from "../transport/http";
import { ErrorMiddlewareOptions } from "../transport/options";
import { getIp, getOsPlatform, getProtocol } from "./helpers";
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
      await handleException(error);
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
 * Usage with `shouldBeCatched`:
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
    await handleException(error);
  }

  return;
};

const handleException = async (error: TraceoError) => {
  try {
    const event: Incident = await prepareException(error);
    await sendIncidentEvent(event);
  } catch (err) {
    //
  }
};

const prepareException = async (error: TraceoError): Promise<Incident> => {
  const { stack } = error;
  const platform = getOsPlatform();

  const { message, name, traces } = await stacktrace.parse(error);
  const event: Incident = {
    type: name,
    message,
    traces,
    stack: String(stack),
    platform,
  };

  return event;
};

export const Middleware = {
  errorMiddleware,
};
