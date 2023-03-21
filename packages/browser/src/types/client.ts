export type BrowserClientConfigType = {
  headers: Dictionary<string>,
  options: TraceoOptions;
}

export interface TraceoOptions {
  apiKey: string;
  appId: string;
  url: string;
  offline?: boolean;
  performance?: boolean;
}

export interface TraceoBrowserError extends Error {}

export interface IBrowserClient {
  handleError(error: TraceoBrowserError): void;
}

export type Dictionary<T> = {
  [key: string]: T;
};
