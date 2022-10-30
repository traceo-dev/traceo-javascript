import { Client } from "../lib/node/client";
import { TraceoOptions } from "../lib/transport/options";

describe("TraceClient", () => {
  let client: Client;

  const clientOptions: TraceoOptions = {
    appId: 35,
    url: "/",
    collectMetrics: true,
    scrapMetricsInterval: 15,
  };

  beforeEach(() => {
    client = new Client(clientOptions);
  });

  //
});
