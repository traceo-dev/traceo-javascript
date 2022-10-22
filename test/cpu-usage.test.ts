import { Client } from "../lib/node/client";
import { CpuUsageMetrics } from "../lib/node/metrics/cpu-usage";

describe("CpuUsageMetrics", () => {
  let metric: CpuUsageMetrics;

  beforeEach(() => {
    metric = new CpuUsageMetrics();
  });

  it("Should check if metrics are collected.", () => {
    expect(metric.collect()).toBeGreaterThan(0);
  });
});
