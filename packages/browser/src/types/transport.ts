import { Dictionary } from "./client";

export interface ITransport {
  request(): Promise<void>;
}

export type RequestOptions = {
  body: object;
  headers: Dictionary<string>;
  url: string;
  protocol: string; //"http" | "https"
  port: string | number;
  host: string;
  method: "POST" | "GET" | "PATCH" | "DELETE";
};
