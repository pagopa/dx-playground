import { portalDashboard, provider } from "@cdktf/provider-azurerm";
import { TerraformStack } from "cdktf";
import { Construct } from "constructs";

import { DashboardConfig } from "../utils/config-validation.js";
import { buildDashboardPropertiesTemplate } from "./dashboard-properties.js";

export class AzureDashboardConstruct extends TerraformStack {
  constructor(scope: Construct, id: string, config: DashboardConfig) {
    super(scope, id);

    // Configure Azure provider
    new provider.AzurermProvider(this, "azure", {
      features: {},
    });

    // Create the dashboard using CDKTF PortalDashboard
    new portalDashboard.PortalDashboard(this, "dashboard", {
      dashboardProperties: buildDashboardPropertiesTemplate(config),
      location: config.location,
      name: config.name.replace(/\s+/g, "_"),
      resourceGroupName: "dashboards", // FIXME: hardcoded resource group name
    });
  }
}
