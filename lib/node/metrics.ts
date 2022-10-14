import { httpService } from "../core/http";
import { Metrics } from "../transport/metrics";
import { TraceoOptions } from "../transport/options";
import { cpu } from "./metrics/cpu-usage";
import { loadRuntimeMetrics } from "./metrics/runtime-data";
import * as os from "node:os";
import { memory } from "./metrics/memory-sage";

const DEFAULT_INTERVAL = 30; //seconds

const collectMetrics = (options: TraceoOptions) => {
  const { metrics } = options;

  loadRuntimeMetrics();

  const INTERVAL =
    (metrics?.interval < 15 ? DEFAULT_INTERVAL : metrics?.interval) * 1000;

  setInterval(() => {
    const metrics: Metrics = {
      cpuUsage: cpu.usage(),
      memory: memory.usage(),
      loadAvg: Number(os.loadavg()[0].toFixed(2)), //The load average is a Unix-specific concept. On Windows, the return value is always [0, 0, 0]
    };

    httpService.sendMetrics(metrics);
  }, INTERVAL);
};

export const metrics = {
  collectMetrics,
};
