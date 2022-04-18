import { BaseObject } from "../transport/base";
import { Platform } from "../transport/events";
import { KlepperIncomingMessage, KlepperRequest } from "../transport/http";
import * as os from "os";

export const mapRequestData = (req: BaseObject): KlepperRequest => {
  const headersData = req.headers || req.header || {};

  const method = req.method;
  const host = headersData["host"] || "<no host>";

  const protocol = getProtocol(req.protocol);

  const originalUrl = (req.originalUrl || req.url) as string;
  const absoluteUrl = `${protocol}://${host}${originalUrl}`;
  const origin = headersData["origin"];
  const query = req.query;
  const payload = req.body || {};
  const ip = getIp(req as KlepperIncomingMessage);

  const connections = {
    absoluteUrl,
    origin,
    protocol,
  };

  const headers = {
    host,
    connection: headersData["connection"],
    origin: headersData["origin"],
  };

  const request = {
    payload,
    headers,
    method,
    query,
    ip,
    url: connections,
  };

  return request;
};

export const getIp = (
  req: KlepperIncomingMessage
): string | string[] | undefined => {
  return req.headers["x-forwarded-for"] || req.socket.remoteAddress;
};

export const getProtocol = (req: KlepperIncomingMessage): string => {
  return req.protocol === "https" || req.secure ? "https" : "http";
};

export const getOsPlatform = (): Platform => {
  return {
      arch: os.arch(),
      platform: os.platform(),
      release: os.release(),
      version: os.version(),
  }
}
