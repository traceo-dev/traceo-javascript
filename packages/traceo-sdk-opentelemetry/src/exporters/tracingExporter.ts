import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import {
  INodeClient,
  utils,
  CAPTURE_ENDPOINT,
  ExportResultCode,
  ReadableSpan,
  ExportResult,
  OTLPExporterNodeConfigBase,
  HttpClient
} from "@traceo-sdk/node-core";
import { OtelMapper } from "./otelMapper";
import { TraceoSpan } from "./types";

export class TraceoTracingExporter extends OTLPTraceExporter {
  private client: INodeClient;

  public constructor(config: OTLPExporterNodeConfigBase = {}) {
    super(config);

    this.client = utils.getGlobalTraceo();
  }

  public export(items: ReadableSpan[], resultCallback: (result: ExportResult) => void): void {
    const isOffline = this.client.options.offline;

    if (isOffline) {
      return;
    }

    const payload: TraceoSpan[] = OtelMapper.mapSpans(items);
    if (payload.length === 0) {
      return;
    }
    
    HttpClient.request({
      body: payload,
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
