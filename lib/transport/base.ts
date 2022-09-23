import { Environment } from "./types";

export interface TraceoGlobal {
  dsn?: string;
  appId?: number;
  environment?: Environment;
}

export interface TraceoError extends Error {}
