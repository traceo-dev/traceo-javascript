import * as http from "http";

export interface KlepperOptions {
    apiKey: string;
    secretKey: string;
}

export interface KlepperError extends Error {}

export interface IKlepperClient {
    errorHandler(
        error: KlepperError,
        req: http.IncomingMessage,
        res: http.ServerResponse,
        next: (error: KlepperError) => void,
    ): void;
    requestHandler(
        req: http.IncomingMessage,
        res: http.ServerResponse,
        next: () => void
    ): void;
}