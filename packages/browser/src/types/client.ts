export interface TraceoOptions {
  apiKey: string;
  appId: string;
  url: string;
  offline?: boolean;
}

export interface TraceoBrowserError extends Error {}

export interface IBrowserClient {
  handleError(error: TraceoBrowserError): void;
}

export type Dictionary<T> = {
  [key: string]: T;
};
