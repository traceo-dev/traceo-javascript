import * as http from "http";
import { sanitizeDsn } from "../node/helpers";
import { RequestStatus } from "../transport/enums";
import {
  EventResponse,
  TraceoEvent,
  TraceoReleaseEvent,
} from "../transport/events";
import { TraceoIncomingMessage, RequestOptions } from "../transport/http";
import { getGlobalClientData } from "./global";
import { isClientConnected } from "./is";

const createHttpOptions = ({
  event,
  api,
}: {
  event?: TraceoEvent | TraceoReleaseEvent;
  api?: string;
}): http.RequestOptions => {
  const client = getGlobalClientData();

  const { dsn } = client;
  const { host, secretKey, appId } = sanitizeDsn(dsn);

  api = api === "release" ? `/release/${appId}` : `/${appId}`;

  const baseOptions: RequestOptions = {
    hostname: host,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": `${Buffer.byteLength(JSON.stringify(event))}`,
      "traceo-secret-key": secretKey
    },
  };

  return {
    path: api,
    ...baseOptions,
  };
};

const statusFromCode = (code: number) =>
  code >= 200 && code <= 299 ? RequestStatus.SUCCESS : RequestStatus.ERROR;

export const sendConnection = (connectionData: TraceoReleaseEvent): void => {
  const httpOptions = createHttpOptions({
    event: connectionData,
    api: "release",
  });

  const request = http.request(httpOptions, (res: TraceoIncomingMessage) => {
    res.setEncoding("utf8");
  });
  request.write(JSON.stringify(connectionData));
  request.end();
};

export const sendEvent = async (
  event: TraceoEvent
): Promise<EventResponse> => {
  const client = getGlobalClientData();

  const baseData = {
    version: client?.version,
  };

  const payload = Object.assign(event, baseData);

  return new Promise<EventResponse>((resolve, reject) => {
    const httpOptions = createHttpOptions({ event });
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
