import { Transport } from ".";
import { BrowserClientConfigType, Dictionary } from "../types/client";
import { BatchPayload, BatchOptions } from "../types/transport";
import { utils } from "../utils";

const DEFAULT_MESSAGES_BYTES_LIMIT = 524288; //0.5MB
const DEFAULT_MESSAGES_COUNT = 50;
const DEFAULT_BATCH_TIMEOUT = 60; //60 seconds

export class Batch {
    private headers: Dictionary<string>;
    private url: string;

    private batchMessage: BatchPayload[] = [];
    private batchMessageCount: number = 0;
    private batchMessageBytes: number = 0;

    private batchMaxMessageCount: number = 0;
    private batchMaxMessageBytes: number = 0;

    private transport: Transport;

    constructor(clientOptions: BrowserClientConfigType, batchOptions: BatchOptions) {
        this.transport = new Transport(clientOptions);

        this.headers = batchOptions.headers;
        this.url = batchOptions.url;

        this.batchMaxMessageCount = batchOptions.batchMaxMessageCount || DEFAULT_MESSAGES_COUNT;
        this.batchMaxMessageBytes = batchOptions.batchMaxMessageBytes || DEFAULT_MESSAGES_BYTES_LIMIT;

        window.addEventListener("beforeunload", () => this.flush());
        this.flushOnInterval();
    }

    private flushOnInterval() {
        setInterval(() => {
            this.flush()
        }, DEFAULT_BATCH_TIMEOUT * 1000);
    }

    public add(payload: BatchPayload) {
        this.batchMessageCount += 1;
        this.batchMessage.push(payload);
        this.batchMessageBytes += utils.toBytes(payload);

        if (this.shouldFlush) {
            this.flush();
        }
    }

    private get shouldFlush(): boolean {
        return (
            this.batchMessageCount >= this.batchMaxMessageCount ||
            this.batchMessageBytes >= this.batchMaxMessageBytes
        );
    }

    private flush() {
        const message = this.batchMessage;
        this.batchMessageCount = 0;
        this.batchMessageBytes = 0;
        this.batchMessage = [];

        this.transport.send(this.url, message, this.headers);
    }
}
