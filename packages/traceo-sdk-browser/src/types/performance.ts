export type ObserverType =
  | "navigation"
  | "paint"
  | "layout-shift"
  | "first-input"
  | "largest-contentful-paint";

export type SupportedObserverType =
  | PerformanceEventTiming[]
  | PerformanceNavigationTiming[]
  | PerformancePaintTiming[]
  | LayoutShift[]
  | LargestContentfulPaint[];

export type MeasureType = {
  name: string | undefined;
  unit: string | undefined;
  value: string | number | boolean | null | undefined;
};

export type BrowserPerformanceType = {
  event: string;
  timestamp: number;
  performance: MeasureType[];
};

interface LayoutShiftAttribution {
  node?: Node;
  previousRect: DOMRectReadOnly;
  currentRect: DOMRectReadOnly;
}

export interface LayoutShift extends PerformanceEntry {
  value: number;
  sources: LayoutShiftAttribution[];
  hadRecentInput: boolean;
}

// https://w3c.github.io/largest-contentful-paint/#sec-largest-contentful-paint-interface
export interface LargestContentfulPaint extends PerformanceEntry {
  renderTime: DOMHighResTimeStamp;
  loadTime: DOMHighResTimeStamp;
  size: number;
  id: string;
  url: string;
  element?: Element;
}
