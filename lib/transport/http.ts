import { RequestType } from "./types";
import * as http from "http";

export interface TraceoServerResponse extends http.ServerResponse {
  send?: Function;
}

export interface TraceoIncomingMessage extends http.IncomingMessage {
  protocol?: string;
  secure?: boolean;
}

export interface RequestOptions extends http.RequestOptions {
  hostname: string;
  method: RequestType;
  path?: string;
  headers?: { [key: string]: string };
}

export enum RequestStatus {
  SUCCESS = "success",
  ERROR = "error",
}

export enum HTTP_ENDPOINT {
  LOG = "/api/worker/log",
  INCIDENT = "/api/worker/incident",
  RUNTIME = "/api/worker/runtime",
  METRICS = "/api/worker/metrics",
}
