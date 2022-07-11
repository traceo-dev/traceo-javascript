import { Environment } from "./types";

export interface TraceoOptions {
  version?: string;
  environment?: Environment;
  dsn: string;
}

export interface ErrorMiddlewareOptions {
  allowLocalhost?: boolean;
  allowHttp?: boolean;
}
