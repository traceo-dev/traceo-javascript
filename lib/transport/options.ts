export interface TraceoOptions {
  offline?: boolean;
  host: string;
  port: number;
  appId: number;
  collectMetrics?: boolean;
}

export interface ErrorMiddlewareOptions {
  allowLocalhost?: boolean;
  allowHttp?: boolean;
}
