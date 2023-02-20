export interface IMetrics<T> {
  collect(): T;
}

export interface IClientMetrics {
  // counter(): ICounter;
  // meauserement(): IMeauserement;
  // gauge(): IGauge;
  // timeSeries(): ITimeSeries;
}

export interface ICounter {
  increment(key: string, val?: number): this;
  decrement(key: string, val?: number): this;
  reset(key: string): this;
}

export interface IMeauserement {
  add(key: string, val: number): this;
  clear(key: string): this;
}

export interface IGauge {
  set(key: string, val: number): this;
  reset(key: string): this;
}

export interface ITimeSeries {
  add(key: string, val: number): this;
  reset(key: string): this;
}
