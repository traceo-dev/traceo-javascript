import { stacktrace } from "stacktrace-parser-node";
import { HttpModule } from "../../core/http";
import { isClientConnected } from "../../core/is";
import { TraceoError } from "../../transport/base";
import { Incident } from "../../transport/events";
import { getOsPlatform } from "../helpers";

type Catch = {
  shouldBeCatched?: (error: any) => boolean;
};

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
  const event: Incident = await prepareException(error);
  const httpModule = new HttpModule("/api/worker/incident");
  httpModule.request({
    body: event,
    onError: (error: Error) => {
      console.error(
        `Traceo Error. Something went wrong while sending new Incident to Traceo. Please report this issue.`
      );
      console.error(`Caused by: ${error.message}`);
    },
  });
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