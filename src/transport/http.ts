import { RequestMethodType } from "./types";
import * as http from "http";

export interface KlepperRequest {
  payload?: Object;
  headers?: Object;
  query?: Object;
  url?: Object;
  method?: RequestMethodType;
  ip?: string | string[] | undefined;
}

export interface KlepperServerResponse extends http.ServerResponse {
  send?: Function;
}

export interface KlepperIncomingMessage extends http.IncomingMessage {
  protocol?: string;
  secure?: boolean;
}

export interface RequestOptions extends http.RequestOptions {
  hostname: string;
  port: number;
  method: RequestMethodType;
  path?: string;
  headers?: { [key: string]: string };
}
