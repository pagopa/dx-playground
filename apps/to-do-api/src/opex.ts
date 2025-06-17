import { App } from "cdktf";
import { MonitoringConfig, MonitoringStack } from "cdktf-monitoring-stack";
import * as path from "path";

const config: MonitoringConfig = {
  actionGroupId:
    "/subscriptions/d7de83e0-0571-40ad-b63a-64c942385eae/resourceGroups/dev/providers/microsoft.insights/actionGroups/dx-d-itn-opex-rg-01",
  apimServiceName: "dx-d-itn-playground-pg-apim-01",
  location: "Italy North",
  logAnalyticsWorkspaceId:
    "/subscriptions/d7de83e0-0571-40ad-b63a-64c942385eae/resourceGroups/dx-d-itn-test-rg-01/providers/Microsoft.OperationalInsights/workspaces/dx-d-itn-playground-azure-function-v3-log-01",
  resourceGroupName: "dx-d-itn-opex-rg-01",
  tags: {
    BusinessUnit: "DevEx",
    CostCenter: "TS000 - Tecnologia e Servizi",
    CreatedBy: "Terraform",
    Environment: "Dev",
    ManagementTeam: "Developer Experience",
    Scope: "Opex PoC",
    Source:
      "https://github.com/pagopa/dx-playground/tree/main/infra/repository",
  },
};

const app = new App();

import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// new AzurermProvider(app, "azurerm", {
//   features: [{ keyVault: [{ purgeSoftDeleteOnDestroy: true }] }],
// });

new MonitoringStack(app, "to-do-api", {
  config,
  openApiFilePath: path.resolve(__dirname, "../docs/openapi.yaml"),
});

app.synth();
