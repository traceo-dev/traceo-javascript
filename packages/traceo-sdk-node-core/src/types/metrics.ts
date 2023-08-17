import { DeepPartial } from ".";
import { MetricData } from "./opentelemetry";

export type MetricType = DeepPartial<MetricData>[];
export interface IMetrics {
  collect(): TraceoMetric[];
}

export type EventLoopMetricType = {
  loop_min: number;
  loop_max: number;
  loop_mean: number;
  loop_stddev: number;
};

export type MemoryUsageMetricType = {
  memory_usage_mb: number;
  memory_usage_percentage: number;
};

export type HeapMetricType = {
  heap_used: number;
  heap_total: number;
  heap_rss: number;
  // heap_native_contexts: number;
  // heap_detached_contexts: number;
};

export type GCObserverType = {
  duration: {
    total: number;
    average: number;
  };
};

export type DefaultMetrics = {
  cpu_usage: number;
  load_avg: number;
} & HeapMetricType &
  EventLoopMetricType &
  MemoryUsageMetricType;

export interface Metrics extends DefaultMetrics {
  [key: string]: any;
}

export type AverageCpuMetricType = {
  idle: number;
  total: number;
};

export type TraceoMetric = {
  name: string;
  type: TraceoMetricType;
  value: number;
  unixTimestamp: number;
};

export enum TraceoMetricType {
  HISTOGRAM,
  COUNTER,
  GAUGE
}
