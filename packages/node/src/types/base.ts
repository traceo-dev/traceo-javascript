export interface TraceoGlobal {
  offline?: boolean;
  connection?: {
    host: string;
    port: number;
  };
  metrics?: {
    collect?: boolean;
    interval?: number;
  };
}

export interface TraceoError extends Error {}
