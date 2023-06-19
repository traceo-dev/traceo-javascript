import { Trace } from "./trace";

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
