import { httpService } from "../core/http";
import { Metrics } from "../transport/metrics";
import { TraceoOptions } from "../transport/options";
import { cpu } from "./metrics/cpu-usage";
import { loadRuntimeMetrics } from "./metrics/runtime-data";

const DEFAULT_INTERVAL = 30; //seconds

const collectMetrics = (options: TraceoOptions) => {
  const { metrics } = options;

  loadRuntimeMetrics();

  const INTERVAL =
    (metrics?.interval < 15 ? DEFAULT_INTERVAL : metrics?.interval) * 1000;

  setInterval(() => {
    const metrics: Metrics = {
      cpuUsage: cpu.usage(),
    };

    httpService.sendMetrics(metrics);
  }, INTERVAL);
};

export const metrics = {
  collectMetrics,
};
