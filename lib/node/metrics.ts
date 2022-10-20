import { HttpModule } from "../core/http";
import { Metrics } from "../transport/metrics";
import { TraceoOptions } from "../transport/options";
import { cpu } from "./metrics/cpu-usage";
import * as os from "node:os";
import { memory } from "./metrics/memory-usage";
import { heap } from "./metrics/heap";
import { eventLoop } from "./metrics/event-loop";
import { toDecimalNumber } from "./helpers";

const DEFAULT_INTERVAL = 30; //seconds

const collectMetrics = (options: TraceoOptions) => {
  const { metrics } = options;

  const INTERVAL =
    (metrics?.interval < 15 ? DEFAULT_INTERVAL : metrics?.interval) * 1000;

  setInterval(() => {
    const metrics: Metrics = {
      cpuUsage: cpu.usage(),
      memory: memory.usage(),
      loadAvg: toDecimalNumber(os.loadavg()[0]),
      heap,
      eventLoopLag: eventLoop.collect(),
    };

    const httpModule = new HttpModule("/api/worker/metrics", metrics);
    httpModule.request();
  }, INTERVAL);
};

export const metrics = {
  collectMetrics,
};
