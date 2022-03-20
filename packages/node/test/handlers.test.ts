// import { errorHandler } from "../src/handlers";
// import * as http from "http";


// describe('errorHandler', () => {
//   const errorMiddleware = errorHandler();

//   let request: http.IncomingMessage;
//   let response: http.ServerResponse;
//   let next = () => undefined;

//   beforeEach(() => { 
//     request = {
//       headers: {
//         working: "stuff"
//       },
//       method: "GET",
//     } as unknown as http.IncomingMessage;
//     response = new http.ServerResponse(request);
//     next = jest.fn();
//   });

//   afterEach(() => {
//     jest.restoreAllMocks();
//   });

//   it('should handle error', () => {
//     errorMiddleware(new Error(), request, response, next);
//     // console.log("RES: ", response.statusCode);

//     // expect(response.statusCode).toBeDefined()
//     // expect(response.statusCode).toBe(200)
//   })
// })