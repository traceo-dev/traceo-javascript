import { TraceoMetric, TraceoMetricType, DataPointType, Dictionary, MetricData, ReadableSpan, ResourceMetrics } from "@traceo-sdk/node-core";
import { TraceoSpan } from "./types";
import { HrTime } from "@opentelemetry/api";

/**
 * Mapper to map OpenTelemetry objects to Traceo responses.
 */
export class OtelMapper {
    protected constructor() { }

    public static mapMetrics(otelMetrics: ResourceMetrics): TraceoMetric[] {
        const result: TraceoMetric[] = [];

        const SUPPORTED_TYPES = [DataPointType.GAUGE, DataPointType.TIME_SERIES, DataPointType.SUM];

        const availableMetrics: MetricData[] = otelMetrics.scopeMetrics
            .flatMap((scope) => scope.metrics || [])
            .filter((metric) => SUPPORTED_TYPES.includes(metric.dataPointType));

        for (const metric of availableMetrics) {
            const traceoMetric: TraceoMetric[] = metric.dataPoints.map((dataPoint) => ({
                name: metric.descriptor.name,
                type: this.mapMetricType(metric.dataPointType),
                value: dataPoint.value,
                // We need here only to get unix with count of seconds
                unixTimestamp: dataPoint.startTime[0]
            }));

            result.push(...traceoMetric);
        }

        return result;
    }

    private static mapMetricType(type: DataPointType): TraceoMetricType {
        switch (type) {
            case DataPointType.GAUGE:
                return TraceoMetricType.GAUGE;
            case DataPointType.SUM:
            case DataPointType.TIME_SERIES:
                return TraceoMetricType.COUNTER;
            case DataPointType.HISTOGRAM:
            case DataPointType.EXPONENTIAL_HISTOGRAM:
                return TraceoMetricType.HISTOGRAM;
            default:
                return TraceoMetricType.COUNTER;
        }
    }

    public static mapSpans(otelSpans: ReadableSpan[]): TraceoSpan[] {
        return otelSpans.map((otel) => ({
            name: otel.name,
            kind: otel.kind.toString(),
            status: otel.status.code.toString(),
            statusMessage: otel.status.message,
            traceId: otel.spanContext().traceId,
            spanId: otel.spanContext().spanId,
            parentSpanId: otel?.parentSpanId,
            serviceName: this.getServiceName(otel),
            attributes: otel.resource.attributes as Dictionary<any>,
            events: JSON.stringify(otel.events),
            startEpochNanos: this.getEpochNanos(otel.startTime),
            endEpochNanos: this.getEpochNanos(otel.endTime),
        }));
    }

    private static getEpochNanos(time: HrTime): number {
        return time[0] + time[1] / 1e9;
    }

    private static getServiceName(span: ReadableSpan) {
        const DEFAULT_SERVICE_NAME = "unknown";

        if (!span.resource.attributes) {
            return DEFAULT_SERVICE_NAME;
        }
        const service_name = span.resource.attributes["service.name"] as string;
        const span_service_name = service_name.startsWith("unknown_service") ? DEFAULT_SERVICE_NAME : service_name;
        return span_service_name;
    }
}