import {
  RequestPayload,
  RequestOptions,
  KlepperResponse,
  KlepperIncomingMessage,
  RequestStatus,
} from "../transport";
import * as http from "http";
import { getGlobalClientData } from "./global";

const KLEPPER_HOST = process.env.KLEPPER_HOST || "localhost";
const KLEPPER_API = process.env.KLEPPER_API || "/test";
const KLEPPER_PORT = process.env.KLEPPER_PORT || 3000;

const createHttpOptions = (payload: RequestPayload): http.RequestOptions => {
  const client = getGlobalClientData();

  const { privateKey } = client;
  const { data } = payload;
  const baseOptions: RequestOptions = {
    hostname: KLEPPER_HOST,
    port: +KLEPPER_PORT,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": `${Buffer.byteLength(JSON.stringify(data))}`,
      "Klepper-Project-Key": privateKey as string,
    },
  };

  return {
    path: KLEPPER_API,
    ...baseOptions,
  };
};

const statusFromCode = (code: number) =>
  code >= 200 && code <= 299 ? RequestStatus.SUCCESS : RequestStatus.ERROR;

/**
 * Send data to Klepper server
 *
 * @param payload
 */
export const sendEvent = async (
  payload: RequestPayload
): Promise<KlepperResponse> => {
  const { data } = payload;

  try {
    return new Promise<KlepperResponse>((resolve, reject) => {
      const httpOptions = createHttpOptions(payload);
      const client = getGlobalClientData();

      if (!httpOptions) {
        reject(new Error("NO HTTP OPTIONS"));
      }

      if (!client) {
        reject(new Error("NO CLIENT DATA IN GLOBAL OBJECT"));
      }

      const request = http.request(
        httpOptions,
        (res: KlepperIncomingMessage) => {
          res.setEncoding("utf8");

          const status = statusFromCode(res?.statusCode as number);
          const isSuccess = status === RequestStatus.SUCCESS;

          if (!isSuccess) {
            reject(new Error("HTTP ERROR: ${res.statusCode}"));
          } else {
            resolve({
              statusCode: res?.statusCode as number,
              statusMessage: "Event successfully sended to Klepper",
            });
          }

          res.on("error", reject);
        }
      );
      request.on("error", reject);

      request.on("timeout", () => {
        request.destroy();
        reject(new Error("TIMEOUT"));
      });

      request.write(JSON.stringify(data));
      request.end();
    });
  } catch (error) {
    throw new Error(""); //to properly handling
  }
};
