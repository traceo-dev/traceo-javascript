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
}
