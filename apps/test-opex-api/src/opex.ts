/* eslint-disable no-console */
import { addAzureDashboard, DashboardConfig } from "@pagopa/opex-dashboard-ts";
import { App, AzurermBackend, AzurermBackendConfig } from "cdktf";

const backendConfig: AzurermBackendConfig = {
  containerName: "tfstate",
  key: "dx.test-opex-api1.tfstate",
  resourceGroupName: "my-rg",
  storageAccountName: "mystorageaccount",
};

// Example configuration

const opexConfig: DashboardConfig = {
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

const app = new App({ hclOutput: true, outdir: "." });

addAzureDashboard({ app, config: opexConfig })
  .then(({ opexStack }) => {
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
