import { Client } from "../lib/node/client";
import { Metrics } from "../lib/node/metrics";
import { Gauge } from "../lib/node/metrics/gauge";

describe("Gauge", () => {
    let metrics: Metrics;
    let gauge: Gauge;

    global.__TRACEO__ = new Client({
        appId: "xxx",
        apiKey: "xxx",
        url: "http://localhost:3000"
    })

    beforeEach(() => {
        metrics = new Metrics();
        metrics.clientGaugeMetrics = {};

        gauge = new Gauge(metrics);
    });

    it("Should return last value passed to gauge for each passed key", () => {
        gauge
            .set("test", 5)
            .set("test-2", 55)
            .set("test", 12);

        expect(metrics.clientGaugeMetrics["test"]).toBe(12);
        expect(metrics.clientGaugeMetrics["test-2"]).toBe(55);
        expect(metrics.clientGaugeMetrics).toStrictEqual({
            "test": 12,
            "test-2": 55
        });
    });

    it("Should reset value for passed key", () => {
        gauge
            .set("test-3", 6)
            .set("test-4", 50)
            .reset("test-3");

        expect(metrics.clientGaugeMetrics["test-3"]).toBe(0);
        expect(metrics.clientGaugeMetrics["test-4"]).toBe(50);
        expect(metrics.clientGaugeMetrics).toStrictEqual({
            "test-3": 0,
            "test-4": 50
        });
    })
});
