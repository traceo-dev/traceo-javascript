export interface Metrics {
  cpuUsage: number;
  memory: {
    mb: number;
    percentage: number;
  };
  loadAvg?: number;
  heap: {
    used: number;
    total: number;
    rss: number;
    nativeContexts: number;
    detachedContexts: number;
  };
  eventLoopLag: {
    min: number;
    max: number;
    mean: number;
    stddev: number;
    // p50: number;
    // p90: number;
    // p99: number;
  };
}
