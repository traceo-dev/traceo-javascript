import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-proto";
import { AggregationTemporality } from "@opentelemetry/sdk-metrics";
import * as opentelemetry from "@opentelemetry/sdk-node";
import { TraceoClient } from "@traceo-sdk/node";

type ExporterOptions = {
    client: TraceoClient,
    /**
     * Add docs
     */
    temporalityPreference?: AggregationTemporality
}
export class TraceoOTLPMetricExporter extends OTLPMetricExporter {
    private client: TraceoClient;

    constructor({
        client,
        temporalityPreference = AggregationTemporality.DELTA
    }: ExporterOptions) {
        super({
            temporalityPreference
        });

        this.client = client;
    }

    export(metrics: opentelemetry.metrics.ResourceMetrics, resultCallback: (result: opentelemetry.core.ExportResult) => void): void {

        /**
         * TODO: Create common node package and put there http/request service
         */
        // parse metrics and send to traceo

        resultCallback({ code: opentelemetry.core.ExportResultCode.SUCCESS });
    }
};