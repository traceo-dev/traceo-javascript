import { stacktrace } from "stacktrace-parser-node";
import { HttpModule } from "../core/http";
import { isClientConnected } from "../core/is";
import { TraceoError, NodeIncidentType } from "../types";
import { getOsDetails } from "../helpers";

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
 *
 */
export const catchException = async (error: any) => {
  if (isClientConnected()) {
    await handleException(error);
  }

  return;
};

const handleException = async (error: TraceoError) => {
  const event: NodeIncidentType = await prepareException(error);
  const httpModule = HttpModule.getInstance();
  httpModule.request({
    url: "/api/worker/incident",
    body: event,
    onError: (error: Error) => {
      console.error(
        `Traceo Error. Something went wrong while sending new Incident to Traceo. Please report this issue.`
      );
      console.error(`Caused by: ${error.message}`);
    }
  });
};

const prepareException = async (error: TraceoError): Promise<NodeIncidentType> => {
  const { stack } = error;
  const platform = getOsDetails();

  const { message, name, traces } = await stacktrace.parse(error);
  const event: NodeIncidentType = {
    name,
    message,
    traces,
    stack,
    platform
  };

  return event;
};
