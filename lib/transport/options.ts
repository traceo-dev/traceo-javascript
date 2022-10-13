export interface TraceoOptions {
  appId: number;
  offline?: boolean;
  connection: {
    host: string;
    port: number;
  };
  metrics?: {
    /* 
      Determining if Traceo should collect metrics from the application.
    */
    collect?: boolean;
    /*
      The number of seconds that the metrics are downloaded. 
      The minimum value for this field is 15. If the value is set below this value, 
      then the data will be downloaded just for this time.
    */
    interval?: number;
  };
}

export interface ErrorMiddlewareOptions {
  allowLocalhost?: boolean;
  allowHttp?: boolean;
}
