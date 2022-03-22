import { RequestPayload, KlepperEvent, KlepperRequest, KlepperResponse } from "@klepper/transport";
import { sendEvent } from "../src/http"

describe("send()", () => {

    let payload: RequestPayload;

    const event: KlepperEvent = {
        date: new Date().getDate(),
        message: "OMG IT NOT WORK",
        type: "OMG",
        traces: [],
        requestData: {
            headers: {
                hello: "guys"
            },
            query: "/hello",
            method: "POST"
        }
    }

    beforeEach(() => {
        payload = {
            data: event
        }
    });

    it("should send a sample request", async () => {
        const response: KlepperResponse = await sendEvent(payload);

        expect(response?.statusCode).toBeDefined();
        expect(response?.statusCode).toBe(200);
    });
})