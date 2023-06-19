# Traceo SDK for Node.js

Library for integration with the [Traceo Platform](https://github.com/traceo-dev/traceo). 

The Traceo platform offers the ability to collect and visualize data from [OpenTelemetry](https://opentelemetry.io/). OpenTelemetry, also known as OTel for short, is a vendor-neutral open-source Observability framework for instrumenting, generating, collecting, and exporting telemetry data such as traces, metrics, logs. [Docs](https://opentelemetry.io/docs/).

### How Traceo use OTel instruments?
By using custom metrics and spans exporters (logs in near future). After receiving data from Otel instruments, the data is successively sent to the Traceo platform, where it is aggregated and visualized.

### Installation
To install this SDK add this package to your package.json like below:
```
yarn add @traceo-sdk/opentelemetry-node
```
or
```
npm install @traceo-sdk/opentelemetry-node
```

Hint: This package require also `@traceo-sdk/node` package to full integaration.

### Usage
First what you need is to initialize `TraceoClient` in your application.
```ts
import { TraceoClient } from "@traceo-sdk/node";

new TraceoClient(<project_id>, {
    host: <traceo_host>
});
```

### Metrics
Just use `TraceoMetricExporter` from `@traceo-sdk/opentelemetry-node` like below. Remember to initialize `TraceoClient` before using export.

```ts
import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { Resource } from "@opentelemetry/resources";
import { TraceoMetricExporter } from "@traceo-sdk/opentelemetry-node";

//other code...

this.meterProvider = new MeterProvider({
    resource: new Resource({
        'service.name': 'traceo-otel'
    })
});

this.meterProvider.addMetricReader(new PeriodicExportingMetricReader({
    exporter: new TraceoMetricExporter(),
    exportIntervalMillis: 10000
}));
```

### Spans
To use the exporter for spans you need to import `TraceoTracingExporter` from `@traceo-sdk/opentelemetry-node` like below:

```ts
import { SimpleSpanProcessor } from "@opentelemetry/tracing";
import { NodeTracerProvider } from "@opentelemetry/node";
import { TraceoTracingExporter } from "@traceo-sdk/opentelemetry-node";

//other code...

this.tracerProvider = new NodeTracerProvider();
this.tracerProvider.addSpanProcessor(new SimpleSpanProcessor(new TraceoTracingExporter()));
this.tracerProvider.register();
```


## Support
Feel free to create Issues, Pull Request and Discussion. If you want to contact with the developer working on this package click [here](mailto:piotr.szewczyk.software@gmail.com).
