import * as http from "http";
import { EventResponse, Incident } from "../transport/events";
import {
  TraceoIncomingMessage,
  RequestOptions,
  HTTP_ENDPOINT,
} from "../transport/http";
import { TraceoLog } from "../transport/logger";
import { Metrics } from "../transport/metrics";
import { RequestType } from "../transport/types";
import { getGlobalClientData } from "./global";
import { TRACEO_SDK_VERSION } from "./version";

const createHttpOptions = (
  path: string,
  method: RequestType = "POST"
): http.RequestOptions => {
  const client = getGlobalClientData();

  const { host, port } = client.connection;
  const baseOptions: RequestOptions = {
    hostname: host,
    port,
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  return {
    path,
    ...baseOptions,
  };
};

const sendLog = async (log: TraceoLog) => {
  const httpOptions = createHttpOptions(HTTP_ENDPOINT.LOG);
  await sendEvent(log, httpOptions);
};

const sendRuntimeMetrics = async (data: {}) => {
  const httpOptions = createHttpOptions(HTTP_ENDPOINT.RUNTIME);
  await sendEvent(data, httpOptions);
};

const sendMetrics = async (data: Metrics) => {
  const httpOptions = createHttpOptions(HTTP_ENDPOINT.METRICS);
  await sendEvent(data, httpOptions);
};

const sendIncident = async (incident: Incident) => {
  const version = TRACEO_SDK_VERSION;
  const baseData = { version };

  const payload = Object.assign(incident, baseData);

  const httpOptions = createHttpOptions(HTTP_ENDPOINT.INCIDENT);
  await sendEvent(payload, httpOptions);
};

const sendEvent = async (
  payload: any,
  httpOptions: http.RequestOptions
): Promise<EventResponse | void> => {
  const { connection, appId } = getGlobalClientData();

  if (!connection || !appId) {
    return;
  }

  return new Promise<EventResponse>((_, reject) => {
    const options: http.RequestOptions = {
      ...httpOptions,
      path: `${httpOptions.path}/${appId}`,
    };

    const request = http.request(options, (res: TraceoIncomingMessage) => {
      res.setEncoding("utf8");
      res.on("error", reject);
    });

    request.on("error", () => {});

    request.on("timeout", () => {
      request.destroy();
      reject({
        statusCode: 400,
        statusMessage:
          "[Traceo] Error during sending event to Traceo. Connection timeout.",
      });
    });

    request.write(JSON.stringify(payload));
    request.end();
  });
};

export const httpService = {
  sendLog,
  sendIncident,
  sendRuntimeMetrics,
  sendMetrics,
};
