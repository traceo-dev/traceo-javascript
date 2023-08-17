import { Dictionary } from ".";
import { Trace } from "./trace";

export type NodeIncidentType = {
  name: string;
  message: string;
  stack: string;
  traces: Trace[];
  platform: Dictionary<string | number>;
};

export interface Platform {
  arch: string;
  platform: string;
  release: string;
}
