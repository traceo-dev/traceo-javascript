import { MetricsRunner } from "./runner";
import { IClientMetrics } from "../types/interfaces/IMetrics";

export class Metrics extends MetricsRunner implements IClientMetrics {
  constructor() {
    super();
  }
}
