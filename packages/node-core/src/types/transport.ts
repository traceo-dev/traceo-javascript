import * as http from "http";

export type RequestType = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type RequestOptionsType = {
    url: string;
    method?: RequestType;
    body: {};
    onError: (error: Error) => void;
    callback?: (resp: http.IncomingMessage) => void;
};