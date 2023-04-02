export type BrowserClientConfigType = {
  headers: Dictionary<string>,
  options: TraceoOptions;
}

export interface TraceoOptions {
  apiKey: string;
  host: string;
  offline?: boolean;
  performance?: boolean;
}

export interface ClientOptions extends Omit<TraceoOptions, "apiKey"> { };

export interface TraceoBrowserError extends Error { }

export interface IBrowserClient {
  handleError(error: TraceoBrowserError): void;
}

export type Dictionary<T> = {
  [key: string]: T;
};
