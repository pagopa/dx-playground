import {
  dataAzurermClientConfig,
  monitorScheduledQueryRulesAlert,
  portalDashboard,
} from "@cdktf/provider-azurerm";
import { Construct } from "constructs";

import { DashboardConfig, Endpoint } from "../../domain/index.js";
import { KustoQueryService } from "../../domain/services/kusto-query-service.js";

export class AzureAlertsConstruct {
  private readonly kustoQueryService = new KustoQueryService();

  constructor(
    scope: Construct,
    config: DashboardConfig,
    dashboard: portalDashboard.PortalDashboard,
    clientConfig: dataAzurermClientConfig.DataAzurermClientConfig,
  ) {
    if (!config.endpoints) return;

    config.endpoints.forEach((endpoint, index) => {
      this.createAvailabilityAlert(
        scope,
        config,
        endpoint,
        index,
        dashboard,
        clientConfig,
      );
      this.createResponseTimeAlert(
        scope,
        config,
        endpoint,
        index,
        dashboard,
        clientConfig,
      );
    });
  }

  private buildAlertDescription(
    endpointPath: string,
    alertType: string,
    threshold: string,
    dashboardId: string,
    tenantId: string,
  ): string {
    const baseDescription =
      alertType === "availability"
        ? `Availability for ${endpointPath} is less than or equal to ${threshold}`
        : `Response time for ${endpointPath} is less than or equal to ${threshold}`;

    // Build the dashboard URL dynamically using TypeScript with tenant GUID
    const dashboardUrl = `https://portal.azure.com/#@${tenantId}/dashboard/arm${dashboardId}`;
    return `${baseDescription} - ${dashboardUrl}`;
  }

  private buildAlertName(
    dashboardName: string,
    alertType: string,
    endpointPath: string,
  ): string {
    const fullName = `${dashboardName}-${alertType} @ ${endpointPath}`;

    // Implement Terraform logic in TypeScript: split("/"), join("_"), remove {|}
    return fullName.split("/").join("_").replace(/[{}]/g, ""); // Remove curly braces
  }

  private createAvailabilityAlert(
    scope: Construct,
    config: DashboardConfig,
    endpoint: Endpoint,
    index: number,
    dashboard: portalDashboard.PortalDashboard,
    clientConfig: dataAzurermClientConfig.DataAzurermClientConfig,
  ) {
    const alertName = this.buildAlertName(
      config.name,
      "availability",
      endpoint.path,
    );

    new monitorScheduledQueryRulesAlert.MonitorScheduledQueryRulesAlert(
      scope,
      `alarm_availability_${index}`, // Changed from availability-alert-{index}
      {
        action: {
          actionGroup: config.action_groups || [],
        },
        autoMitigationEnabled: false,
        dataSourceId: config.data_source,
        description: this.buildAlertDescription(
          endpoint.path,
          "availability",
          "99%",
          dashboard.id,
          clientConfig.tenantId,
        ),
        enabled: true,
        frequency: endpoint.availabilityEvaluationFrequency || 10,
        location: config.location,
        name: alertName,
        query: this.kustoQueryService.buildAvailabilityQuery(endpoint, config),
        resourceGroupName: config.resourceGroupName,
        severity: 1,
        timeWindow: endpoint.availabilityEvaluationTimeWindow || 20,
        trigger: {
          operator: "GreaterThanOrEqual",
          threshold: endpoint.availabilityEventOccurrences || 1,
        },
      },
    );
  }

  private createResponseTimeAlert(
    scope: Construct,
    config: DashboardConfig,
    endpoint: Endpoint,
    index: number,
    dashboard: portalDashboard.PortalDashboard,
    clientConfig: dataAzurermClientConfig.DataAzurermClientConfig,
  ) {
    const alertName = this.buildAlertName(
      config.name,
      "responsetime",
      endpoint.path,
    );

    new monitorScheduledQueryRulesAlert.MonitorScheduledQueryRulesAlert(
      scope,
      `alarm_time_${index}`, // Changed from response-time-alert-{index}
      {
        action: {
          actionGroup: config.action_groups || [],
        },
        autoMitigationEnabled: false,
        dataSourceId: config.data_source,
        description: this.buildAlertDescription(
          endpoint.path,
          "responsetime",
          "1s",
          dashboard.id,
          clientConfig.tenantId,
        ),
        enabled: true,
        frequency: endpoint.responseTimeEvaluationFrequency || 10,
        location: config.location,
        name: alertName,
        query: this.kustoQueryService.buildResponseTimeQuery(endpoint, config),
        resourceGroupName: config.resourceGroupName,
        severity: 1,
        timeWindow: endpoint.responseTimeEvaluationTimeWindow || 20,
        trigger: {
          operator: "GreaterThanOrEqual",
          threshold: endpoint.responseTimeEventOccurrences || 1,
        },
      },
    );
  }
}
