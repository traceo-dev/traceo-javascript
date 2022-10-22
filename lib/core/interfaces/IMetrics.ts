export interface IMetrics<T> {
  collect(): T;
}
