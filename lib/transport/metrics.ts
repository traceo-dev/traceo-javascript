export interface Metrics {
  cpuUsage: number;
  memory: {
    mb: number;
    percentage: number;
  };
  loadAvg?: number;
}
