import { Client } from "../lib/node/client";
import { TraceoOptions } from "../lib/transport/options";

describe("TraceClient", () => {
  let client: Client;

  const clientOptions: TraceoOptions = {
    apiKey: "xxx",
    appId: "xxx",
    url: "http://localhost:3000",
  };

  beforeEach(() => {
    client = new Client(clientOptions);
  });

  it("", () => {
    expect(client).toBeDefined();
  });
});
