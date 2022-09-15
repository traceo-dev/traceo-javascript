import { getGlobalClientData } from "./global";

export const isInternal = (fileName: string): boolean =>
  !!fileName &&
  !fileName.includes("node_modules") &&
  !fileName.startsWith("/") &&
  !fileName.startsWith("node:") &&
  fileName.includes(":\\");

export const isEmpty = (obj?: any): boolean => Object.keys(obj).length === 0;

export const isLocalhost = (ip: string): boolean => {
  return ip === "::1" || ip === "127.0.0.1" ? true : false;
};

export const isClientConnected = (): boolean => !isEmpty(getGlobalClientData());
