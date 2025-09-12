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
  name: "My spec",
  oa3_spec:
    "https://raw.githubusercontent.com/pagopa/opex-dashboard/refs/heads/main/test/data/io_backend_light.yaml",
  overrides: {
    endpoints: {
      "/api/v1/services/{service_id}": {
        availability_evaluation_frequency: 30, // Default: 10
        availability_evaluation_time_window: 50, // Default: 20
        availability_event_occurrences: 3, // Default: 1
        availability_threshold: 0.95, // Default: 99%
        response_time_evaluation_frequency: 35, // Default: 10
        response_time_evaluation_time_window: 55, // Default: 20
        response_time_event_occurrences: 5, // Default: 1
        response_time_threshold: 2, // Default: 1
      },
    },
    hosts: [
      // Use these hosts instead of those inside the OpenApi spec
      "https://example.com",
      "https://example2.com",
    ],
  },
  resource_group_name: "dashboards",
  resource_type: "app-gateway",
  tags: {
    Environment: "TEST",
    Owner: "team-opex",
  },
  timespan: "6m", // Default, a number or a timespan https://docs.microsoft.com/en-us/azure/data-explorer/kusto/query/scalar-data-types/timespan
};

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
