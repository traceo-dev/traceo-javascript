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

new TraceoClient(<project_api_key>, {
    host: <traceo_host>
});

// your code

ReactDOM.render(<App />, document.getElementById("root"));
```

And thats all what you need to handle errors and exceptions in your app. 

### Error Boundary
If you are using React in version >16 you can use `ErrorBoundary` component imported from `@traceo-sdk/react` to catch errors anywhere in the child components.

```ts

const traceoInstance = new TraceoClient(<project_api_key>, {
    host: <traceo_host>
});


<ErrorBoundary traceo={traceoInstance} fallback={(error) => <Fallback error={error} />}>
    // child components
</ErrorBoundary>

```

### Performance
To enable collect of web-vitals data, you have to set `performance` param to `true` like below:

```ts
new TraceoClient(<project_api_key>, {
    host: <traceo_host>,
    performance: true
});
```

## Support
Feel free to create Issues, Pull Request and Discussion.
