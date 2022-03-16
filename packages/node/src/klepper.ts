import { IKlepperClient, KlepperOptions } from "@klepper/transport";
import { errorHandler, requestHandler } from "./handlers";


export class Klepper {
    constructor(){}

    static connect(options: KlepperOptions): IKlepperClient {
        const { apiKey, secretKey } = options;
        console.log(apiKey, secretKey);
        //check authenetication and start session
        
        return ({
            errorHandler,
            requestHandler
        })
    }
}
