// import { KlepperRequest, KlepperResponse, KlepperServerResponse } from "@klepper/transport";
// import * as http from "http";
// import { helpers } from "src/helpers";

// export const requestMiddleware = () => {
//     return function requestMiddleware(
//         req: http.IncomingMessage,
//         res: http.ServerResponse,
//         next: () => void): void {

//         const statusCode = res.statusCode > 500;
//         if (!statusCode) {
//             requestInterceptor(req, res);
//         }

//         next();
//     }
// }

// const requestInterceptor = (req: http.IncomingMessage, res: KlepperServerResponse) => {
//     const send = res.send;
//     res.send = (data: Object) => {
//         res.send = send;

//         const request: KlepperRequest = helpers.mapRequestData(req);
//         const response: KlepperResponse = {
//             body: JSON.stringify(data),
//             statusCode: res.statusCode,
//             statusMessage: res.statusMessage
//         }

//         const event = helpers.createPayloadFromRequest(request, response);
//         captureRequest(event);

//         res.send!(data);
//     }
// }

// const captureRequest = (_data: any) => {
//     throw new Error("NEED IMPLEMENTATION!",);
// }
