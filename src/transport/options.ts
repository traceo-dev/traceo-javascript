import { Environment } from "./types";

export interface TraceoOptions {
  offline?: boolean;
  environment: Environment;
  dsn: string;
}

export interface ErrorMiddlewareOptions {
  allowLocalhost?: boolean;
  allowHttp?: boolean;
}
