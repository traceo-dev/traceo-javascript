import { Trace } from "./trace";
import { Environment } from "./index";

export interface EventResponse {
  statusCode: number;
  statusMessage?: string;
  body?: string;
}

export type NodeIncidentType = {
  name: string;
  message: string;
  stack: string;
  traces: Trace[];
  platform: Platform;
};

export interface Platform {
  arch: string;
  platform: string;
  release: string;
}
