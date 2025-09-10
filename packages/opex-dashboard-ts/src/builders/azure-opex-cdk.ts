import { Construct } from "constructs";

import { AzureOpexConstruct } from "../constructs/azure-dashboard.js";
import { DashboardConfig } from "../utils/config-validation.js";

export class AzureOpexStack extends Construct {
  constructor(scope: Construct, id: string, config: DashboardConfig) {
    super(scope, id);

    // Create dashboard and alerts in the same stack
    new AzureOpexConstruct(this, "dashboard", config);
  }
}
