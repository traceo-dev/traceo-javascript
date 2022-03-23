import { KlepperGlobal } from "../transport";

/**
 * Using internal NodeJS global object to persist information
 *
 * @returns {KlepperGlobal}
 */
export const getGlobalClientData = (): KlepperGlobal =>
  global.__KLEPPER__ || {};

export const setGlobalClientData = (data: KlepperGlobal): void => {
  global.__KLEPPER__ = { ...data };
};

export const clearGlobalClientData = (): void => {
  setGlobalClientData({
    environment: undefined,
    privateKey: undefined,
  });
};
