import { BaseObject } from "../transport/base";
import { Platform } from "../transport/events";
import { TraceoIncomingMessage, TraceoRequest } from "../transport/http";
import * as os from "os";

export const mapRequestData = (req: BaseObject): TraceoRequest => {
  const headersData = req.headers || req.header || {};

  const method = req.method;
  const host = headersData["host"] || "<no host>";

  const protocol = getProtocol(req.protocol);

  const originalUrl = (req.originalUrl || req.url) as string;
  const absoluteUrl = `${protocol}://${host}${originalUrl}`;
  const origin = headersData["origin"];
  const query = req.query;
  const payload = req.body || {};
  const ip = getIp(req as TraceoIncomingMessage);

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

export const sanitizeDsn = (dsn: string) => {
  //TODO: check for https
  const [secretKey, rest] = dsn.replace("http://", "").split(":");
  const [host, appId] = rest.split("/");

  return {
    secretKey,
    host,
    appId,
  };
};
