import { Client } from "../lib/node/client";
import { TraceoOptions } from "../lib/transport/options";

describe("TraceClient", () => {
  let client: Client;

  const clientOptions: TraceoOptions = {
    apiKey: "sasdasdads",
    appId: "92873498234",
    url: "/",
    collectMetrics: true,
    scrapMetricsInterval: 15,
  };

  beforeEach(() => {
    client = new Client(clientOptions);
  });

  //
});
