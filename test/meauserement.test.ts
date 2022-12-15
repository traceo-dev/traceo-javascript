import { Client } from "../lib/node/client";
import { Metrics } from "../lib/node/metrics";
import { Gauge } from "../lib/node/metrics/gauge";
import { Meauserement } from "../lib/node/metrics/meauserement";

describe("Gauge", () => {
  let metrics: Metrics;
  let meauserement: Meauserement;

  global.__TRACEO__ = new Client({
    appId: "xxx",
    apiKey: "xxx",
    url: "http://localhost:3000",
  });

  beforeEach(() => {
    metrics = new Metrics();
    metrics.clientMeauserementMetrics = {};

    meauserement = new Meauserement(metrics);
  });

  it("Should check if values are added to array", () => {
    meauserement.add("test", 15).add("test", 45).add("test", 10);

    expect(metrics.clientMeauserementMetrics).toStrictEqual({
      test: [15, 45, 10],
    });
    expect(metrics.clientMeauserementMetrics["test"]).toStrictEqual([
      15, 45, 10,
    ]);
  });

  it("Should check if values are cleared from array", () => {
    meauserement
      .add("test-2", 55)
      .add("test-2", 66)
      .add("test-3", 90)
      .add("test-2", 15)
      .clear("test-2")
      .clear("test-3");

    expect(metrics.clientMeauserementMetrics["test-2"]).toStrictEqual([]);
    expect(metrics.clientMeauserementMetrics["test-3"]).toStrictEqual([]);
    expect(metrics.clientMeauserementMetrics).toStrictEqual({
      "test-2": [],
      "test-3": [],
    });
  });
});
