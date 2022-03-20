import * as http from "http";

type RequestType = "" | "" | "";

type HttpMethodType = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

const KLEPPER_API = process.env.KLEPPER_API;
const KLEPPER_PORT = process.env.KLEPPER_PORT;

export interface RequestOptions extends http.RequestOptions {
  hostname: string;
  port: number;
  method: HttpMethodType;
  path?: string;
  headers?: { [key: string]: string };
}

export interface RequestPayload {
  data: string;
  type: RequestType;
  url: string;
}

export const getRequestPath = (path: string) =>
  `http://api.klepper.io/api/${path}`;

export const getRequestHeaders = () => {};

export const createHttpOptions = (payload: RequestPayload): RequestOptions => {
  const { url } = payload;
  const baseOptions: RequestOptions = {
    hostname: KLEPPER_API!,
    method: "POST",
    port: +KLEPPER_PORT!,
  };

  return {
    path: getRequestPath(url),
    ...baseOptions,
  };
};

/**
 * Send data to Klepper server
 * 
 * @param payload 
 */
export const sendHttpRequest = (payload: RequestPayload) => {
  const { data } = payload;
  const options = createHttpOptions(payload);
  const request = http.request(options, (res: http.IncomingMessage) => {
    res.setEncoding("utf8");

    res.on("data", () => {});
    res.on("end", () => {});
  });
  request.end(data);
};
