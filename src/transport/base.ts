export interface BaseObject {
  [key: string]: any;
}

export interface TraceoGlobal {
  dsn: string;
  appId?: string;
  version?: string;
}

export interface TraceoError extends Error {}
