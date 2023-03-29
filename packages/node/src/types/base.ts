export interface TraceoGlobal {
  projectId?: number;
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
