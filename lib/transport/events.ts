import { Trace } from "./trace";
import { Environment } from "./types";

export interface EventResponse {
  statusCode: number;
  statusMessage?: string;
  body?: string;
}

export interface Incident {
  type: string;
  message: string;
  stack: string;
  traces: Trace[];
  env?: Environment;
  platform: Platform;
}

export interface Platform {
  arch: string;
  platform: string;
  release: string;
  version: string;
}
