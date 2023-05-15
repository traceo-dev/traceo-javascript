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

        transport.request({
            body: items,
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