import { TraceoOptions } from "../src/types";
import { Client } from "../src/client";

describe("TraceClient", () => {
  let client: Client;

  const clientOptions: TraceoOptions = {
    apiKey: "sasdasdads",
    projectId: "92873498234",
    url: "/",
    collectMetrics: true,
    scrapMetricsInterval: 15,
  };

  beforeEach(() => {
    client = new Client(clientOptions);
  });

  //
});
