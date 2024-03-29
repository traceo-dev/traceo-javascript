import * as os from "os";
import * as v8 from "v8";

import { Dictionary, INodeClient } from "./types";
import { TraceoIncomingMessage } from "./types";

export const getIp = (req: TraceoIncomingMessage): string | string[] | undefined => {
  return req.headers["x-forwarded-for"] || req.socket.remoteAddress;
};

export const getProtocol = (req: TraceoIncomingMessage): string => {
  return req.protocol === "https" || req.secure ? "https" : "http";
};

export const getOsDetails = (): Dictionary<string | number> => {
  return {
    arch: os.arch(),
    platform: os.platform(),
    name: os.release(),
    machine: os.machine(),
    node: process.versions["node"],
    v8: process.versions["v8"]
  };
};

export const toDecimalNumber = (val: number, decimal: number = 2) => Number(val.toFixed(decimal));

export const getGlobalTraceo = (): INodeClient => {
  if (global && typeof global === "object" && global["__TRACEO__"]) {
    return global["__TRACEO__"];
  }

  return {
    headers: {},
    options: {
      apiKey: undefined,
      host: undefined
    }
  };
};

export const currentUnix = (): number => {
  return Math.floor(Date.now() / 1000);
};

export const isEmpty = (obj?: any): boolean => Object.keys(obj).length === 0;

export const isLocalhost = (ip: string): boolean => {
  return ip === "::1" || ip === "127.0.0.1" ? true : false;
};

export const isClientConnected = (): boolean => !isEmpty(getGlobalTraceo());
