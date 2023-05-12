/**
 * Interface with data provided by client
 */
export interface TraceoOptions {
  apiKey: string;
  offline?: boolean;
  host: string;
  /* 
    Determining if Traceo should collect metrics from the application.
  */
  collectMetrics?: boolean;
  /*
    The number of seconds that the metrics are downloaded. 
    The minimum value for this field is 15. If the value is set below this value, 
    then the data will be downloaded just for this time.
  */
  scrapMetricsInterval?: number;
  /*
    Default is 60s.
    Value can't be smaller than 15.
  */
  scrapLogsInterval?: number;
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
};
