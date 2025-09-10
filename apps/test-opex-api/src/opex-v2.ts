/* eslint-disable no-console */
import { DashboardConfig, generateDashboard } from "@pagopa/opex-dashboard-ts";
import { AzurermBackend } from "cdktf";
import { backendConfig } from "opex-common";

export const opexConfig: DashboardConfig = {
  action_groups: [
    "/subscriptions/uuid/resourceGroups/my-rg/providers/microsoft.insights/actionGroups/my-action-group-email",
    "/subscriptions/uuid/resourceGroups/my-rg/providers/microsoft.insights/actionGroups/my-action-group-slack",
  ],
  data_source:
    "/subscriptions/uuid/resourceGroups/my-rg/providers/Microsoft.Network/applicationGateways/my-gtw",
  location: "West Europe",
  name: "My Dashboard",
  oa3_spec:
    "https://raw.githubusercontent.com/pagopa/opex-dashboard/main/test/data/io_backend.yaml",
  resource_type: "app-gateway",
  timespan: "5m",
} as const;

generateDashboard(opexConfig)
  .then(({ app, opexStack }) => {
    // TODO questo deve esser applicato allo stack
    new AzurermBackend(opexStack, {
      ...backendConfig,
      key: "dx.test-opex-api1.tfstate",
    });

    // Synthesize the Terraform code
    app.synth();
    console.log("Terraform CDKTF code generated successfully");
  })
  .catch((error: unknown) => {
    console.error("Error generating dashboard:", error);
    process.exit(1);
  });
