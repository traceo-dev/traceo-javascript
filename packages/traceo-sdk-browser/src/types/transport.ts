import { BrowserInfoType } from "./browser";
import { Dictionary } from "./client";
import { Trace } from "./stacktrace";

export interface ITransport {
  request(): Promise<void>;
}

export enum CAPTURE_ENDPOINT {
  INCIDENT = "/api/capture/incident",
  BROWSER_PERFS = "/api/capture/browser/perfs"
}

export type RequestOptions<T> = {
  body: T;
  headers: Dictionary<string>;
  url: string;
  protocol: string; //"http" | "https"
  port: string | number;
  host: string;
  method: "POST" | "GET" | "PATCH" | "DELETE";
};

export type BrowserIncidentType = {
  name?: string;
  message?: string;
  stack?: string;
  details: object;
  traces?: Trace[];
};

export type BatchPayload = {
  [key: string]:
    | string
    | number
    | boolean
    | undefined
    | null
    | BatchPayload
    | Array<BatchPayload>;
};

export interface BatchOptions {
  url: string;
  headers: Dictionary<string>;
  batchMaxMessageCount?: number;
  batchMaxMessageBytes?: number;
}
