/* eslint-disable no-console */
import { addOpexStack, DashboardConfig } from "@pagopa/opex-dashboard-ts";
import { App, AzurermBackend, AzurermBackendConfig } from "cdktf";

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

const backendConfig: AzurermBackendConfig = {
  containerName: "tfstate",
  key: "dx.test-opex-api1.tfstate",
  resourceGroupName: "my-rg",
  storageAccountName: "mystorageaccount",
};

const app = new App({ hclOutput: true, outdir: "." });

(async function () {
  try {
    const { opexStack: s1 } = await addOpexStack({
      app,
      config: opexConfig,
    });

    new AzurermBackend(s1, {
      ...backendConfig,
      key: "dx.test-opex-api1.tfstate",
    });

    // Add more stacks if needed
    // const { opexStack: s2 } = await addAzureDashboard({
    //   app,
    //   config: opexConfig,
    // });
    // new AzurermBackend(s2, {
    //   ...backendConfig,
    //   key: "dx.test-opex-api2.tfstate",
    // });

    app.synth();

    console.log("Terraform CDKTF code generated successfully");
  } catch (error) {
    console.error("Error generating Terraform CDKTF code:", error);
    process.exit(1);
  }
})();
