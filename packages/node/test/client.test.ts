import { ClientOptions } from "../src/types";
import { Client } from "../src/client";

describe("TraceClient", () => {
  let client: Client;

  const clientOptions: ClientOptions = {
    host: "/",
    collectMetrics: true,
    scrapMetricsInterval: 15,
  };

  beforeEach(() => {
    client = new Client("xxx", clientOptions);
  });

  //
});
