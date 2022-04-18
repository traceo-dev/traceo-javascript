import { CatchType, ExceptionPriority } from "./enums";
import { KlepperRequest } from "./http";
import { Trace } from "./trace";
import { Environment } from "./types";

export interface EventResponse {
  statusCode: number;
  statusMessage?: string;
  body?: string;
}

export interface RequestEvent {
  request: KlepperRequest;
  response: EventResponse;
  date: number;
}

export interface ErrorEvent {
  name: string;
  stack: string;
  message?: string;
  date: number;
}

export interface KlepperEvent {
  projectId?: string;
  type: string;
  message: string;
  stack: string;
  traces: Trace[];
  requestData?: KlepperRequest;
  catchType?: CatchType;
  options?: {
    priority?: ExceptionPriority;
    tag?: string;
  };
  sdk?: string;
  env?: Environment;
  version?: string;
  platform: Platform;
}

export interface KlepperReleaseEvent {
  version?: string;
  env: Environment;
  os: Platform;
}

export interface Platform {
  arch: string;
  platform: string;
  release: string;
  version: string;
}
