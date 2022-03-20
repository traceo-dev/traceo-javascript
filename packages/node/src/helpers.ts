import { BaseObject, KlepperIncomingMessage, KlepperRequest, KlepperResponse, KlepperStackFrame } from "@klepper/transport";
import { StackFrame } from "stack-trace";

const mapStackFrames = (stackFrames: StackFrame[], onlyInternal: boolean = true) => {
    const frames: KlepperStackFrame[] = [];

    const parse = (stackFrame: StackFrame): KlepperStackFrame => {
        return {
            functionName: stackFrame.getFunctionName(),
            lineNumber: stackFrame.getLineNumber(),
            columnNumber: stackFrame.getColumnNumber(),
            fileName: stackFrame.getFileName(),
            methodName: stackFrame.getMethodName(),
        }
    }

    stackFrames.map((f) => {
        if (onlyInternal) {
            const fileName = f.getFileName();
            const isInternal = fileName && !fileName.includes('node_modules') && !fileName.startsWith('/') && !fileName.startsWith('node:') && fileName.includes(":\\");

            isInternal ? frames.push(parse(f)) : null;
        } else {
            frames.push(parse(f));
        }
    });

    return frames;
}

const createPayloadFromRequest = (req: KlepperRequest, res: KlepperResponse) => {
    return {
        request: req,
        response: res,
        date: new Date().getDate()
    }
}

const mapRequestData = (req: BaseObject): KlepperRequest => {
    const headersData = req.headers || req.header || {};

    const method = req.method;
    const host = headersData["host"] || '<no host>';

    const protocol = getProtocol(req.protocol)

    const originalUrl = (req.originalUrl || req.url) as string;
    const absoluteUrl = `${protocol}://${host}${originalUrl}`;
    const origin = headersData["origin"];
    const query = req.query;
    const payload = req.body || {};
    const ip = getIp(req as KlepperIncomingMessage);

    const connections = {
        absoluteUrl,
        origin,
        protocol
    };

    const headers = {
        host,
        connection: headersData["connection"],
        origin: headersData["origin"]
    }

    const request = {
        payload,
        headers,
        method,
        query,
        ip,
        url: connections,
    };

    return request;
}

const getIp = (req: KlepperIncomingMessage): string | string[] | undefined => {
    return req.headers['x-forwarded-for'] || req.socket.remoteAddress;
}

const isLocalhost = (req: KlepperIncomingMessage): boolean => {
    const ip = getIp(req);
    return ip === "::1" || ip === "127.0.0.1" ? true : false;
}

const getProtocol = (req: KlepperIncomingMessage): string => {
    return req.protocol === 'https' || req.secure
        ? 'https'
        : 'http';
}


export const helpers = {
    getIp,
    createPayloadFromRequest,
    mapRequestData,
    mapStackFrames,
    getProtocol,
    isLocalhost
}