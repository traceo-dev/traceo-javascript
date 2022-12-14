import { Metrics } from ".";
import { IGauge } from "../../core/interfaces/metrics";

export class Gauge implements IGauge {
    private field: Record<string, number>;
    
    constructor(runner: Metrics) {
        this.field = runner.clientGaugeMetrics;

        if (!this.field) {
            this.field = {};
        }
    }

    public set(key: string, val: number): this {
        if (!this.field[key]) {
            this.field[key] = 0;
        }
        this.field[key] = val;
        return this;
    }

    public reset(key: string): this {
        this.field[key] = 0;

        return this;
    }
}