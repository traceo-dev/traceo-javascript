/**
 * Interface with data provided by client.
 */
export interface TraceoOptions {
  apiKey: string;

  /**
   * In offline mode no data is collected by the SDK.
   */

  offline?: boolean;

  /**
   * Host address to your Traceo Platform.
   */
  host: string;

  /*
   * Determining if Traceo should collect metrics from the application.
   * Default set to true.
   */
  collectMetrics?: boolean;

  /*
   * The number of miliseconds to scrap metrics and logs.
   */
  exportIntervalMillis?: number;
}

export interface ErrorMiddlewareOptions {
  allowLocalhost?: boolean;
  allowHttp?: boolean;
}

/**
 * Object stored in global nodejs interface.
 * Implement this interface in node clients.
 */
export interface INodeClient {
  options: TraceoOptions;
  headers: { [key: string]: any };
}
