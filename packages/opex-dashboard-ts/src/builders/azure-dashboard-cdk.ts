import { App } from "cdktf";
import { Construct } from "constructs";

import { AzureAlertsConstruct } from "../constructs/azure-alerts.js";
import { AzureDashboardConstruct } from "../constructs/azure-dashboard.js";
import { DashboardConfig } from "../utils/config-validation.js";

class AzureDashboardStack extends Construct {
  constructor(scope: Construct, id: string, config: DashboardConfig) {
    super(scope, id);

    // Create dashboard
    new AzureDashboardConstruct(this, "dashboard", config);

    // Create alerts
    new AzureAlertsConstruct(this, config);
  }
}

export class AzureDashboardCdkBuilder {
  constructor(private config: DashboardConfig) {}

  build(): string {
    const app = new App();

    // Create the main stack with dashboard and alerts
    new AzureDashboardStack(app, "opex-dashboard", this.config);

    // Synthesize to generate Terraform code
    app.synth();

    // Return the generated Terraform code (this would be from the cdktf.out directory)
    return "Terraform code generated in cdktf.out directory";
  }
}
