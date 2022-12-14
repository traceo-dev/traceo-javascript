import { Metrics } from ".";
import { ITimeSeries } from "../../core/interfaces/metrics";

export class TimeSeries implements ITimeSeries {
    private field: Record<string, number>;

    constructor(metrics: Metrics) {
        this.field = metrics.clientTimeSeriesMetrics;

        if (!this.field) {
            this.field = {};
        }
    }

    public add(key: string, val: number): this {
        if (!this.field[key]) {
            this.field[key] = 0;
        }
        this.field[key] += val;

        return this;
    }

    public reset(key: string): this {
        this.field[key] = 0;

        return this;
    }
}