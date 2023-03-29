import * as http from "http";
import { RequestType } from "./index";

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
  ERROR = "error"
}

export enum CAPTURE_ENDPOINT {
  LOG = "/api/capture/log",
  INCIDENT = "/api/capture/incident",
  RUNTIME = "/api/capture/runtime",
  METRICS = "/api/capture/metrics"
}
