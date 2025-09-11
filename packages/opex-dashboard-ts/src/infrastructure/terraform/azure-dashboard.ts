import { portalDashboard, provider } from "@cdktf/provider-azurerm";
import { TerraformStack } from "cdktf";
import { Construct } from "constructs";

import { DashboardConfig } from "../../domain/index.js";
import { AzureAlertsConstruct } from "./azure-alerts.js";
import { buildDashboardPropertiesTemplate } from "./dashboard-properties.js";

export class AzureOpexStack extends TerraformStack {
  constructor(scope: Construct, id: string, config: DashboardConfig) {
    super(scope, id);

    // Configure Azure provider
    new provider.AzurermProvider(this, "azure", {
      features: [{}],
      storageUseAzuread: true,
    });

    // Create the dashboard using CDKTF PortalDashboard
    new portalDashboard.PortalDashboard(this, "dashboard", {
      dashboardProperties: buildDashboardPropertiesTemplate(config),
      location: config.location,
      name: config.name.replace(/\s+/g, "_"),
      resourceGroupName: config.resourceGroupName,
    });

    // Create alerts within the same stack
    new AzureAlertsConstruct(this, config);
  }
}
