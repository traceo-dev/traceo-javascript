export interface TraceoOptions {
  apiKey: string;
  appId: string;
  url: string;
}

export interface TraceoError extends Error {}

export interface IBrowserClient {
  sendError(error: TraceoError): void;
}

export type Dictionary<T> = {
  [key: string]: T;
};
