import Bowser from "bowser";
import { BrowserInfoType } from "./types/browser";

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

export const utils = {
  browserDetails
};
