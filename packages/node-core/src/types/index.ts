export * from "./events";
export * from "./http";
export * from "./logger";
export * from "./metrics";
export * from "./trace";
export * from "./metrics";
export * from "./options";
export * from "./transport";
export * from "./opentelemetry";

export interface TraceoError extends Error {}

export type Environment = "production" | "development" | "test";

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type Dictionary<T> = {
  [key: string]: T;
};
