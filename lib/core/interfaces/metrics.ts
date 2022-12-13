export interface IMetrics<T> {
  collect(): T;
}

export interface IClientMetrics {
  increment(key: string, val?: number): IClientMetrics;
  decrement(key: string, val?: number): IClientMetrics;
}
