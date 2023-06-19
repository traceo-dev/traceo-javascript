# Traceo SDK for Vue

Library for integration with [Traceo Platform](https://github.com/traceo-dev/traceo).

### Installation
To install this SDK add this package to your project like below:
```
yarn add @traceo-sdk/vue
```
or
```
npm install @traceo-sdk/vue
```

### Usage
To use this SDK initialize `TraceoClient` in your application.
```ts
import { TraceoClient } from "@traceo-sdk/vue";

const app = createApp({ ... });

new TraceoClient(<project_api_key>, {
    host: <traceo_host>
});

// your code

app.mount("#app");
```

### Performance
To enable collect of web-vitals data, you have to set performance param to true like below:
```ts
new TraceoClient(<project_api_key>, {
    host: <traceo_host>,
    performance: true
});
```

## Support
Feel free to create Issues, Pull Request and Discussion.
