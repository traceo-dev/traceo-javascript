import * as http from "http";

export interface KlepperOptions {
  environment?: ENVIRONMENT;
  privateKey: string;
}

export interface KlepperError extends Error {
  date: number;
}

export type RequestMethodType = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface KlepperRequest {
  payload?: Object,
  headers?: Object,
  query?: Object,
  url?: Object,
  method?: RequestMethodType,
  ip?: string | string[] | undefined,
}

export interface KlepperResponse {
  statusCode: number;
  statusMessage?: string;
  body?: string;
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

export class ErrorMiddlewareOptions {
  allowLocalhost?: boolean = true;
  allowHttp?: boolean = true;
  environment?: string;
}

export interface KlepperEvent {
  projectId?: string;
  type: string;
  message: string;
  date: number;
  traces: Trace[];
  requestData?: KlepperRequest;
}

export interface Trace {
  fileName: string;
  functionName: string;
  absolutePath: string;
  rowNo: number;
  colNo: number;
  isInternal: boolean;
}

export interface RequestOptions extends http.RequestOptions {
  hostname: string;
  port: number;
  method: RequestMethodType;
  path?: string;
  headers?: { [key: string]: string };
}

export interface RequestPayload {
  data: KlepperEvent;
  // url: string;
}

export enum RequestStatus {
  SUCCESS = "success",
  ERROR = "error"
}

type ENVIRONMENT = undefined | "prod" | "dev" | "test";

export interface KlepperGlobal {
  environment?: ENVIRONMENT;
  privateKey?: string;
}