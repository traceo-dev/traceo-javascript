import { Client } from "../lib/node/client";
import { Metrics } from "../lib/node/metrics";
import { Counter } from "../lib/node/metrics/counter";
import { Gauge } from "../lib/node/metrics/gauge";

describe("Gauge", () => {
    let metrics: Metrics;
    let counter: Counter;

    global.__TRACEO__ = new Client({
        appId: "xxx",
        apiKey: "xxx",
        url: "http://localhost:3000"
    })

    beforeEach(() => {
        metrics = new Metrics();
        metrics.clientCounterMetrics = {};

        counter = new Counter(metrics);
    });

    it("Should increment by 1", () => {
        counter
            .increment("test");

        expect(metrics.clientCounterMetrics["test"]).toBe(1);
        expect(metrics.clientCounterMetrics).toStrictEqual({
            "test": 1
        });
    });

    it("Should increment by sum of the provided values", () => {
        counter
            .increment("test-1", 12)
            .increment("test-2", 55)
            .increment("test-1", 6);

        expect(metrics.clientCounterMetrics["test-1"]).toBe(18);
        expect(metrics.clientCounterMetrics["test-2"]).toBe(55);
        expect(metrics.clientCounterMetrics).toStrictEqual({
            "test-1": 18,
            "test-2": 55
        });
    });

    it("Should decrement value by 1", () => {
        counter
            .increment("test-3", 100)
            .decrement("test-3");

        expect(metrics.clientCounterMetrics["test-3"]).toBe(99);
        expect(metrics.clientCounterMetrics).toStrictEqual({
            "test-3": 99
        });
    });

    it("Should decrement value by provided value", () => {
        counter
            .increment("test-4", 100)
            .decrement("test-4", 50);

        expect(metrics.clientCounterMetrics["test-4"]).toBe(50);
        expect(metrics.clientCounterMetrics).toStrictEqual({
            "test-4": 50
        });
    });

    it("Should reset one of value", () => {
        counter
            .increment("test-5", 21)
            .increment("test-6", 37)
            .reset("test-5");

        expect(metrics.clientCounterMetrics["test-5"]).toBe(0)
        expect(metrics.clientCounterMetrics["test-6"]).toBe(37)
        expect(metrics.clientCounterMetrics).toStrictEqual({
            "test-5": 0,
            "test-6": 37
        });
    })
});
