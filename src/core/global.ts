import { KlepperGlobal } from "../transport/base";

export const getGlobalClientData = (): KlepperGlobal =>
  global.__KLEPPER__ || {};

export const setGlobalClientData = (data: KlepperGlobal): void => {
  global.__KLEPPER__ = { ...data };
};
