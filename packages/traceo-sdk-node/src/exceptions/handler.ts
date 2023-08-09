import { stacktrace } from "stacktrace-parser-node";
import {
  TraceoError,
  NodeIncidentType,
  CAPTURE_ENDPOINT,
  utils,
  HttpClient
} from "@traceo-sdk/node-core";

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
export const catchException = async (error: Error) => {
  if (utils.isClientConnected()) {
    await handleException(error);
  }

  return;
};

const handleException = async (error: TraceoError) => {
  const event: NodeIncidentType = await prepareException(error);

  HttpClient.request({
    url: CAPTURE_ENDPOINT.INCIDENT,
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
  const platform = utils.getOsDetails();

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
