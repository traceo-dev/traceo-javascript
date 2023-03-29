import { Batch } from "../transport/batch";
import { BrowserClientConfigType } from "../types/client";
import { BrowserPerformanceType, LargestContentfulPaint, LayoutShift, ObserverType } from "../types/performance";
import { utils } from "../utils";

export class Performance {
    private batch: Batch;

    constructor(configs: BrowserClientConfigType) {
        this.batch = new Batch(configs, {
            headers: configs?.headers,
            url: `/api/worker/browser/perf/${configs?.options?.projectId}`
        });
    }

    public initPerformanceCollection() {
        this.handleCLS();
        this.handleFID();
        this.handleLCP();
        this.handleNavigationEntry();
        this.handlePaintEntry();
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/PerformancePaintTiming
    // first-paint, first-contentful-paint
    private handlePaintEntry() {
        const handle = (entries: PerformancePaintTiming[]): void => {
            // const now = dayjs
            for (const entry of entries) {
                const entryName = entry.name === "first-paint"
                    ? "FP"
                    : entry.name === "first-contentful-paint"
                        ? "FCP"
                        : undefined;

                const payload: BrowserPerformanceType = {
                    event: entry.entryType,
                    timestamp: utils.currentUnix(),
                    performance: [{
                        name: entryName,
                        unit: "miliseconds",
                        value: entry.startTime
                    }]
                };

                this.batch.add(payload);
            }
        }

        this.observe<LargestContentfulPaint>("paint", handle);
    }

    // largest-contentful-paint
    // https://developer.mozilla.org/en-US/docs/Web/API/LargestContentfulPaint
    private handleLCP() {
        const handle = (entries: LargestContentfulPaint[]): void => {
            if (entries.length === 0) {
                return;
            }

            const entry = entries[entries.length - 1];
            const payload: BrowserPerformanceType = {
                event: entry.entryType,
                timestamp: utils.currentUnix(),
                performance: [{
                    value: entry.startTime,
                    unit: 'millisecond',
                    name: "LCP"
                }]
            };
            this.batch.add(payload);
        }
        this.observe<LargestContentfulPaint>("largest-contentful-paint", handle);
    }

    // layout-shift
    // https://developer.mozilla.org/en-US/docs/Web/API/LayoutShift
    private handleCLS() {
        const handle = (entries: LayoutShift[]): void => {
            for (const entry of entries) {
                if (entry.hadRecentInput) {
                    // layout-shift event is triggered after every user input 
                    return;
                }

                const payload: BrowserPerformanceType = {
                    event: entry.entryType,
                    timestamp: utils.currentUnix(),
                    performance: [{
                        name: "CLS",
                        unit: " ",
                        value: entry.value
                    }]
                }
                this.batch.add(payload);
            }

        }
        this.observe<LayoutShift>("layout-shift", handle);
    }

    // first-input-delay
    // https://developer.mozilla.org/en-US/docs/Glossary/First_input_delay
    private handleFID() {
        const handle = (entries: PerformanceEventTiming[]): void => {
            for (const entry of entries) {
                const payload: BrowserPerformanceType = {
                    event: entry.entryType,
                    timestamp: utils.currentUnix(),
                    performance: [{
                        name: "FID",
                        unit: "miliseconds",
                        value: entry.processingStart - entry.startTime
                    }]
                };
                this.batch.add(payload);
            }
        }
        this.observe<PerformanceEventTiming>("first-input", handle);
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming
    private handleNavigationEntry() {
        const handle = (entries: PerformanceNavigationTiming[]): void => {
            for (const entry of entries) {
                const payload: BrowserPerformanceType = {
                    event: entry.entryType,
                    timestamp: utils.currentUnix(),
                    performance: [
                        {
                            name: "domCompleted",
                            unit: "miliseconds",
                            value: entry.domComplete
                        },
                        {
                            name: "domContentLoadedEventEnd",
                            unit: "miliseconds",
                            value: entry.domContentLoadedEventEnd
                        },
                        {
                            name: "domInteractive",
                            unit: "miliseconds",
                            value: entry.domInteractive
                        },
                        {
                            name: "loadEventEnd",
                            unit: "miliseconds",
                            value: entry.loadEventEnd
                        }
                    ]
                };

                this.batch.add(payload);
            }
        };

        this.observe<PerformanceNavigationTiming>("navigation", handle);
    }

    private observe = <T>(
        type: ObserverType,
        callback: (entries: T[]) => void
    ): PerformanceObserver | undefined => {
        if (window.PerformanceObserver) {
            const supported = PerformanceObserver.supportedEntryTypes;
            if (!supported.includes(type)) {
                return;
            }

            const observe = new PerformanceObserver((entries => callback(entries.getEntries() as T[])));
            observe.observe({ type, buffered: true });

            return observe;
        };

        return undefined;
    }
}
