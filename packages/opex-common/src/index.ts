import { AzurermBackendConfig } from "cdktf";
import { MonitoringConfig } from "cdktf-monitoring-stack";

export const opexConfig: MonitoringConfig = {
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
} as const;

export const backendConfig: AzurermBackendConfig = {
  containerName: "terraform-state",
  key: "dx.opex.tfstate",
  resourceGroupName: "terraform-state-rg",
  storageAccountName: "tfdevdx",
} as const;
