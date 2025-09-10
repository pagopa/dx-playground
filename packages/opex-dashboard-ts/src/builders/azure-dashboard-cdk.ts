import { Construct } from "constructs";

import { AzureAlertsConstruct } from "../constructs/azure-alerts.js";
import { AzureDashboardConstruct } from "../constructs/azure-dashboard.js";
import { DashboardConfig } from "../utils/config-validation.js";

export class AzureDashboardStack extends Construct {
  constructor(scope: Construct, id: string, config: DashboardConfig) {
    super(scope, id);

    // Create dashboard
    new AzureDashboardConstruct(this, "dashboard", config);

    // Create alerts
    new AzureAlertsConstruct(this, config);
  }
}
