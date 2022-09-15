import { TraceoGlobal } from "../transport/base";

export const getGlobalClientData = (): TraceoGlobal => global.__TRACEO__ || {};

export const setGlobalClientData = (data: TraceoGlobal): void => {
  global.__TRACEO__ = { ...data };
};
