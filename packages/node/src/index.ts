import * as Middleware from "./middlewares/index";
import * as Klepper from "./main";

export { Middleware, Klepper }


/**
 * TODO:
 * 
 * 1. captureException function which is placed in catch clause in code when we want to capture an error
 * 2. communication between library and server, send exceptions to server
 * 3. ENDING OF ERROR HANDLER, CREATE EXCEPTION OBJECT
 * 
 */

/**
 * IDEAS:
 * 
 * 1. add parameters of exceptions which client want to handle
 * 2. 
 */

/**
 * PROBLEMS:
 * 
 * 1. do we need to capture also requests and not only exceptions?
 * 2. do we need to parse stack objects from exceptions and then send to server or we can send whole exception stack, name and description?
 */