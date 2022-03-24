import { ExceptionPriority } from "./enums";
import { Environment } from "./types";

export interface KlepperOptions {
  environment?: Environment;
  privateKey: string;
}

export interface ErrorMiddlewareOptions {
  allowLocalhost?: boolean;
  allowHttp?: boolean;
}

export interface CatchExceptionsOptions {
  tag?: string;
  priority?: ExceptionPriority;
}
