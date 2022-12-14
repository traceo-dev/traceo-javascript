export type EventLoopMetricType = {
  min: number;
  max: number;
  mean: number;
  stddev: number;
};

export type MemoryUsageMetricType = {
  mb: number;
  percentage: number;
};

export type HeapMetricType = {
  used: number;
  total: number;
  rss: number;
  nativeContexts: number;
  detachedContexts: number;
};

export type GCObserverType = {
  duration: {
    total: number;
    average: number;
  };
};

export interface DefaultMetrics {
  cpuUsage: number;
  memory: MemoryUsageMetricType;
  loadAvg?: number;
  heap: HeapMetricType;
  eventLoopLag: EventLoopMetricType;
  gc: GCObserverType;
}

export interface Metrics extends DefaultMetrics {
  [key: string]: any;
}

export type MeauserementValueType = { [key: string]: any };

export type AverageCpuMetricType = {
  idle: number;
  total: number;
};
