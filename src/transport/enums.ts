export enum CatchType {
  /**
   * Exception handled by middleware, eq. Middleware.errorMiddleware()
   */
  MIDDLEWARE = "middleware",

  /**
   * Exception handled by function catchException() in interceptors or try/catch clause
   */
  INTERNAL = "internal",
}

export enum RequestStatus {
  SUCCESS = "success",
  ERROR = "error",
}
