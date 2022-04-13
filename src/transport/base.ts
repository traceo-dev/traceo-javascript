import { Environment } from "./types";

export interface BaseObject {
  [key: string]: any;
}

export interface KlepperGlobal {
  environment?: Environment;
  privateKey?: string;
  appId?: string;
  version?: string;
}

export interface KlepperError extends Error {}
