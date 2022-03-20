import * as http from "http";

export interface KlepperOptions {
  apiKey: string;
  secretKey: string;
}

export interface KlepperError extends Error {}

type RequestMethodType = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface KlepperRequest {
  payload: Object,
  headers: Object,
  query: Object,
  url: Object,
  method: RequestMethodType,
  ip: string | string[] | undefined,
}

export interface KlepperResponse {
  body: string;
  statusCode: number;
  statusMessage?: string;
}

export interface BaseObject { [key: string]: any };

export interface KlepperServerResponse extends http.ServerResponse {
  send?: Function;
}

export interface KlepperIncomingMessage extends http.IncomingMessage {
  protocol?: string;
  secure?: boolean;
}

export interface KlepperStackFrame extends Object {
  functionName: string;
  methodName: string;
  lineNumber: number;
  columnNumber: number;
  fileName: string;
}

export interface RequestEvent {
  request: KlepperRequest;
  response: KlepperResponse;
  date: number;
}

export interface ErrorEvent {
  name: string;
  stack: string;
  message?: string;
  date: number;
}

export interface KlepperOptions { }

// export interface ErrorMiddlewareOptions {
//   notAllowLocalhost?: boolean;
//   allowHttp?: boolean;
//   environment?: string;
// }

export class ErrorMiddlewareOptions {
  allowLocalhost?: boolean = true;
  allowHttp?: boolean = true;
  environment?: string;
}