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

new TraceoClient({
    projectId: <your_project_id>,
    apiKey: <app_api_key>,
    url: <you_traceo_instance_url>
});

// your code

app.mount("#app");
```

## Support
Feel free to create Issues, Pull Request and Discussion. If you want to contact with the developer working on this package click [here](mailto:piotr.szewczyk.software@gmail.com).
