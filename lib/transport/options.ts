export interface TraceoOptions {
  appId: number;
  offline?: boolean;
  url: string;
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
}

export interface ErrorMiddlewareOptions {
  allowLocalhost?: boolean;
  allowHttp?: boolean;
}
