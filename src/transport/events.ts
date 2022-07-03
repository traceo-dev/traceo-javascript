import { CatchType, ExceptionPriority } from "./enums";
import { TraceoRequest } from "./http";
import { Trace } from "./trace";
import { Environment } from "./types";

export interface EventResponse {
  statusCode: number;
  statusMessage?: string;
  body?: string;
}

export interface RequestEvent {
  request: TraceoRequest;
  response: EventResponse;
  date: number;
}

export interface ErrorEvent {
  name: string;
  stack: string;
  message?: string;
  date: number;
}

export interface TraceoEvent {
  type: string;
  message: string;
  stack: string;
  traces: Trace[];
  requestData?: TraceoRequest;
  catchType?: CatchType;
  options?: {
    priority?: ExceptionPriority;
    tag?: string;
  };
  env?: Environment;
  version?: string;
  platform: Platform;
}

export interface TraceoReleaseEvent {
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
