import { Platform } from "../transport/events";
import { TraceoIncomingMessage } from "../transport/http";
import * as os from "os";

export const getIp = (
  req: TraceoIncomingMessage
): string | string[] | undefined => {
  return req.headers["x-forwarded-for"] || req.socket.remoteAddress;
};

export const getProtocol = (req: TraceoIncomingMessage): string => {
  return req.protocol === "https" || req.secure ? "https" : "http";
};

export const getOsPlatform = (): Platform => {
  return {
    arch: os.arch(),
    platform: os.platform(),
    release: os.release(),
    version: os.version(),
  };
};

export const toDecimalNumber = (val: number, decimal: number = 2) =>
  Number(val.toFixed(decimal));

// export const sanitizeDsn = (dsn: string) => {
//   const [secretKey, rest] = dsn
//     .replace("http://", "")
//     .replace("https://", "")
//     .split(":");
//   const [host, appId] = rest.split("/");

//   return {
//     secretKey,
//     host,
//     appId,
//   };
// };
