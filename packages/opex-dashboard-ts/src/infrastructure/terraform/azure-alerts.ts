import {
  dataAzurermClientConfig,
  monitorScheduledQueryRulesAlert,
  portalDashboard,
} from "@cdktf/provider-azurerm";
import { Construct } from "constructs";

import { Endpoint, ValidDashboardConfig } from "../../domain/index.js";
import { KustoQueryService } from "../../domain/services/kusto-query-service.js";

export class AzureAlertsConstruct {
  private readonly kustoQueryService = new KustoQueryService();

  constructor(
    scope: Construct,
    config: ValidDashboardConfig,
    dashboard: portalDashboard.PortalDashboard,
    clientConfig: dataAzurermClientConfig.DataAzurermClientConfig,
    resolvedLocation: string,
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
        resolvedLocation,
      );
      this.createResponseTimeAlert(
        scope,
        config,
        endpoint,
        index,
        dashboard,
        clientConfig,
        resolvedLocation,
      );
    });
  }

  private buildAlertDescription(
    endpointPath: string,
    alertType: "availability" | "responsetime",
    thresholdValue: number,
    dashboardId: string,
    tenantId: string,
  ): string {
    const url = `https://portal.azure.com/#@${tenantId}/dashboard/arm${dashboardId}`;
    if (alertType === "availability") {
      const pct = (thresholdValue * 100).toFixed(0) + "%";
      return `Availability for ${endpointPath} is below ${pct} - ${url}`;
    }
    return `Response time (p95) for ${endpointPath} is above ${thresholdValue}s - ${url}`;
  }

  private buildAlertName(
    dashboardName: string,
    alertType: "availability" | "responsetime",
    endpointPath: string,
  ): string {
    return `${this.slug(dashboardName)}-${alertType}_${this.slug(endpointPath)}`;
  }

  private createAvailabilityAlert(
    scope: Construct,
    config: ValidDashboardConfig,
    endpoint: Endpoint,
    index: number,
    dashboard: portalDashboard.PortalDashboard,
    clientConfig: dataAzurermClientConfig.DataAzurermClientConfig,
    resolvedLocation: string,
  ) {
    const alertName = this.buildAlertName(
      config.name,
      "availability",
      endpoint.path,
    );
    const availabilityThreshold = endpoint.availability_threshold ?? 0.99;
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
          availabilityThreshold,
          dashboard.id,
          clientConfig.tenantId,
        ),
        enabled: true,
        frequency: endpoint.availability_evaluation_frequency ?? 10,
        location: resolvedLocation,
        name: alertName,
        query: this.kustoQueryService.buildAvailabilityQuery(
          endpoint,
          config,
          "alert",
        ),
        resourceGroupName: config.resource_group_name,
        severity: 1,
        tags: config.tags,
        timeWindow: endpoint.availability_evaluation_time_window ?? 20,
        trigger: {
          operator: "GreaterThanOrEqual",
          threshold: endpoint.availability_event_occurrences ?? 1,
        },
      },
    );
  }

  private createResponseTimeAlert(
    scope: Construct,
    config: ValidDashboardConfig,
    endpoint: Endpoint,
    index: number,
    dashboard: portalDashboard.PortalDashboard,
    clientConfig: dataAzurermClientConfig.DataAzurermClientConfig,
    resolvedLocation: string,
  ) {
    const alertName = this.buildAlertName(
      config.name,
      "responsetime",
      endpoint.path,
    );
    const responseThreshold = endpoint.response_time_threshold ?? 1;

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
          responseThreshold,
          dashboard.id,
          clientConfig.tenantId,
        ),
        enabled: true,
        frequency: endpoint.response_time_evaluation_frequency ?? 10,
        location: resolvedLocation,
        name: alertName,
        query: this.kustoQueryService.buildResponseTimeQuery(
          endpoint,
          config,
          "alert",
        ),
        resourceGroupName: config.resource_group_name,
        severity: 1,
        tags: config.tags,
        timeWindow: endpoint.response_time_evaluation_time_window ?? 20,
        trigger: {
          operator: "GreaterThanOrEqual",
          threshold: endpoint.response_time_event_occurrences ?? 1,
        },
      },
    );
  }

  /* Build a safe slug for embedding in Azure resource names */
  private slug(input: string): string {
    return (
      input
        .trim()
        // remove leading slashes to avoid leading underscores later
        .replace(/^\/+/, "")
        // normalize spaces and unsupported chars
        .replace(/\s+/g, "-")
        .replace(/[{}]/g, "")
        .replace(/[^a-zA-Z0-9-_/]/g, "-")
        // drop trailing slashes first
        .replace(/\/+$/g, "")
        // turn path separators into underscores
        .replace(/\//g, "_")
        // collapse duplicates
        .replace(/-+/g, "-")
        .replace(/_+/g, "_")
        // finally, trim leading/trailing separators
        .replace(/^[-_]+/, "")
        .replace(/[-_]+$/, "")
    );
  }
}
