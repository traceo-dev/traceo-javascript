import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import {
    INodeClient,
    utils,
    transport,
    CAPTURE_ENDPOINT,
    ExportResultCode,
    ReadableSpan,
    ExportResult,
    OTLPExporterNodeConfigBase
} from "@traceo-sdk/node-core";

export class TraceoTracingExporter extends OTLPTraceExporter {
    private client: INodeClient;

    constructor(config: OTLPExporterNodeConfigBase = {}) {
        super(config);

        this.client = utils.getGlobalTraceo();
    }

    public export(items: ReadableSpan[], resultCallback: (result: ExportResult) => void): void {
        const isOffline = this.client.options.offline;

        if (isOffline) {
            return;
        }

        const spans = items.map((span) => {
            return {
                name: span.name,
                attributes: span.attributes,
                status: span.status,
                links: span.links,
                events: span.events,
                duration: span.duration,
                startTime: span.startTime,
                endTime: span.endTime,
                parentSpanId: span?.parentSpanId,
                kind: span.kind,
                resource: span.resource,
                spanContext: {
                    traceId: span.spanContext().traceId,
                    spanId: span.spanContext().spanId
                }
            }
        });

        transport.request({
            body: spans,
            url: CAPTURE_ENDPOINT.TRACING,
            method: "POST",
            callback: () => {
                resultCallback({ code: ExportResultCode.SUCCESS });
            },
            onError: (error: Error) => {
                console.error(
                    `Traceo Error. Something went wrong while sending new Traces to Traceo. Please report this issue.`
                );
                console.error(`Caused by: ${error.message}`);

                resultCallback({ code: ExportResultCode.FAILED });
            }
        });

    }
}