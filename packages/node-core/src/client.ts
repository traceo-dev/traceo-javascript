import { INodeClient, TraceoOptions } from "./types";
import { TRACEO_SDK_VERSION } from "./version";

export abstract class CoreClient implements INodeClient {
  public options: TraceoOptions;
  public headers: { [key: string]: any };

  constructor(
    apiKey: string,
    { collectMetrics = true, offline = false, ...opts }: Omit<TraceoOptions, "apiKey">
  ) {
    this.configGlobalClient();

    this.options = {
      ...opts,
      collectMetrics,
      offline,
      apiKey
    };

    this.headers = {
      "x-sdk-name": "node",
      "x-sdk-version": TRACEO_SDK_VERSION,
      "x-sdk-key": apiKey
    };

    if (!this.isOffline) {
      this.initSDK();
    } else {
      console.warn("Traceo does not collect any data because it is offline mode.");
    }
  }

  private configGlobalClient(): void {
    global["__TRACEO__"] = this;
  }

  private get isOffline(): boolean {
    return this.options.offline;
  }

  public abstract initSDK(): void;
}
