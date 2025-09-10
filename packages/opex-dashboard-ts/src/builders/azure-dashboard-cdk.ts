import { Construct } from "constructs";

import { AzureDashboardConstruct } from "../constructs/azure-dashboard.js";
import { DashboardConfig } from "../utils/config-validation.js";

export class AzureDashboardStack extends Construct {
  constructor(scope: Construct, id: string, config: DashboardConfig) {
    super(scope, id);

    // Create dashboard and alerts in the same stack
    new AzureDashboardConstruct(this, "dashboard", config);
  }
}
