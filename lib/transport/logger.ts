export enum LogLevel {
  Debug = "debug",
  Log = "log",
  Info = "info",
  Warn = "warn",
  Error = "error",
}

export interface TraceoLog {
  timestamp: string;
  message: string;
  level: LogLevel;
  unix: number;
  resources?: { [key: string]: string };
}
