import Bowser from "bowser";
import { BrowserInfoType } from "./types/browser";
import { BrowserClientConfigType } from "./types/client";

const bowser = Bowser.getParser(window.navigator.userAgent);

const browserDetails = (): BrowserInfoType => {
  const browser = bowser.getBrowser();
  const engine = bowser.getEngine();
  const platform = bowser.getPlatform();
  const os = bowser.getOS();
  const url = window.location.href;

  return {
    browser,
    engine,
    platform,
    os,
    url
  };
};

const toBytes = (obj: any) => {
  let str = null;
  if (typeof obj === "string") {
    str = obj;
  } else {
    str = JSON.stringify(obj);
  }
  const bytes = new TextEncoder().encode(str).length;
  return bytes;
};

const getGlobalConfigs = (): BrowserClientConfigType => {
  return window.__TRACEO__ || {
    headers: undefined,
    options: undefined
  }
};

const currentUnix = (): number => {
  return Math.floor(Date.now() / 1000);
}

export const utils = {
  browserDetails,
  getGlobalConfigs,
  toBytes,
  currentUnix
};
