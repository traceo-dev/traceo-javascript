# Traceo SDK for Node.js
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Library for integration with the [Traceo Platform](https://github.com/traceo-dev/traceo).

### Installation
To install this SDK add this package to your package.json like below:
```
yarn add @traceo-sdk/node
```
or
```
npm install @traceo-sdk/node
```

### Usage
First what you need is to initialize `TraceoClient` in your application.
```ts
import { TraceoClient } from "@traceo-sdk/node";

new TraceoClient({
    appId: <your_application_id>,
    url: <you_traceo_instance_url>
});
```

`TraceoClient` options require two parameters. `appId` is a unique identifier of an application created on the Traceo platform. Information about application ID you can get from the Traceo Platform in `Settings|Details` tab.  `url` parameter specifies the address where your Traceo Platform instance is located. Address should be passed in the format `<protocol>://<domain>:<port>`, eq. `http://localhost:3000`.

### Incidents handling
Incidents are all the exceptions and other problems that occur in your application. After each exception occurs, the Traceo SDK catches the exception and sends it to the Traceo Platform. This package provide the two main ways to catch exceptions in your application - `Handlers` and `Middlewares`.

##### Handlers
The easiest way is to use `ExceptionsHandlers.catchException()` in `try-catch` clause like below:
```ts
import { ExceptionHandlers } from "@traceo-sdk/node";

try {
    //your code
} catch (error) {
    ExceptionHandlers.catchException(error);
}
```

If you use [NestJS](https://nestjs.com/) framework then you can also create [Interceptor](https://docs.nestjs.com/interceptors) to catch exceptions like below:

traceo.interceptor.ts
```ts
import { ExceptionHandlers } from "@traceo-sdk/node";
//other imports

@Injectable()
export class TraceoInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(null, (exception) => {
        ExceptionHandlers.catchException(exception);
      }),
    );
  }
}
```

main.ts
```ts
  app.useGlobalInterceptors(new TraceoInterceptor());
```

##### Middleware
Another approach is to use `ExceptionMiddlewares.errorMiddleware()`. If you use the [Express.js](https://expressjs.com/) framework, you can use our middleware like below:

Javascript:
```js
import { ExceptionMiddlewares } from "@traceo-sdk/node";

app.use(ExceptionMiddlewares.errorMiddleware());
```

Typescript:
```ts
const { ExceptionMiddlewares } from "@traceo-sdk/node";

app.use(ExceptionMiddlewares.errorMiddleware() as express.ErrorRequestHandler);
```

Remember that `ExceptionMiddlwares.errorMiddleware()` should be before any other error middlewares and after all routes/controllers.

##### Middleware options


| Parameter  | Description   | Default |
|---|---|---|
| `allowLocalhost`  | If false then middleware doesn't catch exceptions from requests coming from `localhost` | true |
|  `allowHttp` | If false then middleware doesn't catch exceptions received from requests where `req.protocol = http` and catch only exception received with `https`  |    true|

### Logger
The Traceo SDK can be used also as a logger. Each log is saved on the Traceo Platform, thanks to which it is possible to later easily access the recorded information.

To use logger feature in your app use `Logger` from `traceo` package like below:
```ts
import { Logger } from "@traceo-sdk/node";

const logger = new Logger();
```

The `logger` can use 5 different types of log: `log`, `info`, `debug`, `warn`, `error`. Each function responsible for logging the appropriate log type accepts a list of arguments in the parameter.
```ts
logger.log("Traceo", "Example", "Log");
// [TraceoLogger][LOG] - 31.10.2022, 13:55:45 - Traceo Example Log

logger.debug("Traceo", {
    hello: "World"
});
// [TraceoLogger][DEBUG] - 31.10.2022, 13:58:00 - Traceo { hello: 'World' }
```
`Logger` can be used also as a reference from `TraceoClient`:
```ts
const traceo = new TraceoClient({...});
traceo.logger.log("Traceo");
```
### Metrics
To activate the collection of metrics from your application, set the parameter `collectMetrics` in your `TraceoClient` to true:

```ts
new TraceoClient({ collectMetrics: true });
```
Metrics are collected from the application every 30 seconds. If you want to collect metrics at a different time interval then you can use the `scrapMetricsInterval` parameter.

```ts
new TraceoClient({ scrapMetricsInterval: <interval_in_seconds> });
```

Remember that provided `scrapMetricsInterval` can't be less than `15` seconds.

## Support
Feel free to create Issues, Pull Request and Discussion. If you want to contact with the developer working on this package click [here](mailto:piotr.szewczyk.software@gmail.com).
