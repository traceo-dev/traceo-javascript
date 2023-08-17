import { Dictionary } from "@traceo-sdk/node-core";

export type TraceoSpan = {
  name: string;
  kind: string;
  status: string;
  statusMessage: string;
  traceId: string;
  spanId: string;
  parentSpanId: string;
  serviceName: string;
  startEpochNanos: number;
  endEpochNanos: number;
  attributes: Dictionary<String>;
  // sent as string-json
  events: string;
};

export type TraceoSpanEvent = {
  name: string;
  epochNanos: number;
  attributes: Dictionary<string>;
};
