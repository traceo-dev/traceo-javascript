import { ExceptionPriority } from "./enums";
import { Environment } from "./types";

export interface KlepperOptions {
  version?: string;
  environment: Environment;
  privateKey: string;
  appId: string;
}

export interface ErrorMiddlewareOptions {
  allowLocalhost?: boolean;
  allowHttp?: boolean;
}

export interface CatchExceptionsOptions {
  tag?: string;
  priority?: ExceptionPriority;
}
