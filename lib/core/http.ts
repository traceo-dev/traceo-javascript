import * as http from "http";
import { sanitizeDsn } from "../node/helpers";
import { EventResponse, Incident } from "../transport/events";
import { TraceoIncomingMessage, RequestOptions } from "../transport/http";
import { getGlobalClientData } from "./global";
import { isClientConnected } from "./is";
import { TRACEO_SDK_VERSION } from "./version";

enum RequestStatus {
  SUCCESS = "success",
  ERROR = "error",
}

const createHttpOptions = (path: string): http.RequestOptions => {
  const client = getGlobalClientData();

  const { dsn } = client;
  const { host, secretKey } = sanitizeDsn(dsn);

  const baseOptions: RequestOptions = {
    hostname: host,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Traceo-Secret-Key": secretKey,
    },
  };

  return {
    path,
    ...baseOptions,
  };
};

const statusFromCode = (code: number) =>
  code >= 200 && code <= 299 ? RequestStatus.SUCCESS : RequestStatus.ERROR;

export const sendRuntimeMetrics = async (data: {}) => {
  const { appId, environment } = getGlobalClientData();

  if (!appId) {
    return;
  }

  const httpOptions = createHttpOptions(
    `/${appId}/${environment}/metrics/runtime`
  );
  await sendEvent(data, httpOptions);
};

export const sendIncidentEvent = async (incident: Incident) => {
  const { environment, appId } = getGlobalClientData();

  if (!environment || !appId) {
    return;
  }

  const version = TRACEO_SDK_VERSION;
  const baseData = { version, env: environment };

  const payload = Object.assign(incident, baseData);

  const httpOptions = createHttpOptions(`/${appId}`);
  await sendEvent(payload, httpOptions);
};

export const sendEvent = async (
  payload: any,
  httpOptions: http.RequestOptions
): Promise<EventResponse | void> => {
  const { environment, dsn } = getGlobalClientData();

  if (!environment || !dsn) {
    return;
  }

  return new Promise<EventResponse>((resolve, reject) => {
    // const httpOptions = createHttpOptions({ payload });
    if (!httpOptions) {
      reject({
        statusCode: 400,
        statusMessage:
          "[Traceo] Error during sending event to Traceo. No HTTP options.",
      });
    }

    if (!isClientConnected()) {
      reject({
        statusCode: 400,
        statusMessage:
          "[Traceo] Error during sending event to Traceo. No client global data in NodeJS scope.",
      });
    }

    const request = http.request(httpOptions, (res: TraceoIncomingMessage) => {
      res.setEncoding("utf8");

      const status = statusFromCode(res?.statusCode as number);
      const isSuccess = status === RequestStatus.SUCCESS;

      if (!isSuccess) {
        reject({
          statusCode: res?.statusCode as number,
          statusMessage: "[Traceo] Error during sending event to Traceo.",
        });
      } else {
        resolve({
          statusCode: res?.statusCode as number,
          statusMessage: "[Traceo] Event successfully sended to Traceo.",
        });
      }

      res.on("error", reject);
    });

    request.on("error", reject);

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
