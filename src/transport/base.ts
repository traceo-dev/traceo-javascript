import { Environment } from "./types";

export interface TraceoGlobal {
  dsn: string;
  appId?: string;
  environment: Environment;
}

export interface TraceoError extends Error {}
