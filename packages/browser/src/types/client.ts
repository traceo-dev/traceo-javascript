export interface TraceoOptions {
  apiKey: string;
  appId: string;
  url: string;
}

export interface TraceoBrowserError extends Error {}

export interface IBrowserClient {
  sendError(error: TraceoBrowserError): void;
}

export type Dictionary<T> = {
  [key: string]: T;
};
