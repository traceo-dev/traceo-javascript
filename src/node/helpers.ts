import {
  BaseObject,
  KlepperIncomingMessage,
  KlepperRequest,
} from "../transport";
// import { StackFrame } from "stack-trace";

// const prepareStackTraces = (stackFrames: StackFrame[]): Trace[] => {
//     const parseTraces = (frame: StackFrame): Trace => {
//         return {
//             functionName: frame.getFunctionName(),
//             rowNo: frame.getLineNumber(),
//             colNo: frame.getColumnNumber(),
//             fileName: frame.getFileName(),
//             absolutePath: frame.getFunctionName(),
//             isInternal: isInternal(frame.getFileName()),
//         }
//     }

//     const traces = stackFrames.map((frame) => parseTraces(frame)) || [];
//     return traces;
// }

const isInternal = (fileName: string): boolean =>
  !!fileName &&
  !fileName.includes("node_modules") &&
  !fileName.startsWith("/") &&
  !fileName.startsWith("node:") &&
  fileName.includes(":\\");

const mapRequestData = (req: BaseObject): KlepperRequest => {
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

const getIp = (req: KlepperIncomingMessage): string | string[] | undefined => {
  return req.headers["x-forwarded-for"] || req.socket.remoteAddress;
};

const isLocalhost = (req: KlepperIncomingMessage): boolean => {
  const ip = getIp(req);
  return ip === "::1" || ip === "127.0.0.1" ? true : false;
};

const getProtocol = (req: KlepperIncomingMessage): string => {
  return req.protocol === "https" || req.secure ? "https" : "http";
};

const isEmpty = (obj: any) => Object.keys(obj).length === 0;

export const helpers = {
  getIp,
  mapRequestData,
  isEmpty,
  // prepareStackTraces,
  getProtocol,
  isLocalhost,
};
