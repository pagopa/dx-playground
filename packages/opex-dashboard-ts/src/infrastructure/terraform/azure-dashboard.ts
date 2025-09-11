import {
  dataAzurermClientConfig,
  dataAzurermResourceGroup,
  portalDashboard,
  provider,
} from "@cdktf/provider-azurerm";
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

    // Get current Azure client configuration for tenant info
    const clientConfig = new dataAzurermClientConfig.DataAzurermClientConfig(
      this,
      "current",
      {},
    );

    // Lookup Resource Group to inherit location
    const rg = new dataAzurermResourceGroup.DataAzurermResourceGroup(
      this,
      "rg",
      { name: config.resource_group_name },
    );
    const resolvedLocation = rg.location;

    // Create the dashboard using CDKTF PortalDashboard
    const dashboard = new portalDashboard.PortalDashboard(this, "dashboard", {
      dashboardProperties: buildDashboardPropertiesTemplate(config),
      location: resolvedLocation,
      name: config.name.replace(/\s+/g, "_"),
      resourceGroupName: config.resource_group_name,
      tags: config.tags,
    });

    // Create alerts within the same stack, passing dashboard reference and tenant
    new AzureAlertsConstruct(
      this,
      config,
      dashboard,
      clientConfig,
      resolvedLocation,
    );
  }
}
