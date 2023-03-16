# Traceo SDK for React

Library for integration with [Traceo Platform](https://github.com/traceo-dev/traceo).

### Installation
To install this SDK add this package to your project like below:
```
yarn add @traceo-sdk/react
```
or
```
npm install @traceo-sdk/react
```

### Usage
To use this SDK initialize `TraceoClient` in your application.
```ts
import { TraceoClient } from "@traceo-sdk/react";

new TraceoClient({
    appId: <your_application_id>,
    apiKey: <app_api_key>,
    url: <you_traceo_instance_url>
});

// your code

ReactDOM.render(<App />, document.getElementById("root"));
```

And thats all what you need to handle errors and exceptions in your app. 

### Error Boundary
If you are using React in version >16 you can use `ErrorBoundary` component imported from `@traceo-sdk/react` to catch errors anywhere in the child components.

```ts

const traceoInstance = new TraceoClient({
    appId: <your_application_id>,
    apiKey: <app_api_key>,
    url: <you_traceo_instance_url>
});


<ErrorBoundary traceo={traceoInstance} fallback={(error) => <Fallback error={error} />}>
    // child components
</ErrorBoundary>

```

## Support
Feel free to create Issues, Pull Request and Discussion. If you want to contact with the developer working on this package click [here](mailto:piotr.szewczyk.software@gmail.com).
