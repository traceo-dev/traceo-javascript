import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-proto";
import {
    CAPTURE_ENDPOINT,
    MetricData,
    ScopeMetrics,
    transport,
    OTLPExporterNodeConfigBase,
    AggregationTemporality,
    ExportResult,
    ExportResultCode,
    ResourceMetrics
} from "@traceo-sdk/node-core";

export class TraceoOTLPMetricExporter extends OTLPMetricExporter {
    constructor(config: OTLPExporterNodeConfigBase) {
        super({
            ...config,
            temporalityPreference: AggregationTemporality.DELTA
        });
    }

    public export(metrics: ResourceMetrics, resultCallback: (result: ExportResult) => void): void {
        const scopeMetrics: ScopeMetrics[] = metrics.scopeMetrics;
        const flatMetrics: MetricData[] = scopeMetrics.flatMap(scope => scope.metrics || []);

        transport.request({
            body: flatMetrics,
            url: CAPTURE_ENDPOINT.METRICS,
            method: "POST",
            onError: (error: Error) => {
                console.error(
                    `Traceo Error. Something went wrong while sending new Metrics to Traceo. Please report this issue.`
                );
                console.error(`Caused by: ${error.message}`);
            }
        });

        resultCallback({ code: ExportResultCode.SUCCESS });
    }
};