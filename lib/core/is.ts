import { getGlobalClientData } from "./global";

export const isEmpty = (obj?: any): boolean => Object.keys(obj).length === 0;

export const isLocalhost = (ip: string): boolean => {
  return ip === "::1" || ip === "127.0.0.1" ? true : false;
};

export const isClientConnected = (): boolean => !isEmpty(getGlobalClientData());
