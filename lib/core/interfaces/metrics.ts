export interface IMetrics<T> {
  collect(): T;
}

export interface IClientMetrics {
  counter(): ICounter;
}

export interface ICounter {
  increment(key: string, val?: number): this;
  decrement(key: string, val?: number): this;
  reset(key: string): this;
}
