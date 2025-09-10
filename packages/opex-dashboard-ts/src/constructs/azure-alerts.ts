import { monitorScheduledQueryRulesAlert } from "@cdktf/provider-azurerm";
import { Construct } from "constructs";

import {
  buildAvailabilityQuery,
  buildResponseTimeQuery,
} from "../core/kusto-queries.js";
import { DashboardConfig } from "../utils/config-validation.js";
import { Endpoint } from "../utils/endpoint-parser.js";

export class AzureAlertsConstruct {
  constructor(scope: Construct, config: DashboardConfig) {
    if (!config.endpoints) return;

    config.endpoints.forEach((endpoint, index) => {
      this.createAvailabilityAlert(scope, config, endpoint, index);
      this.createResponseTimeAlert(scope, config, endpoint, index);
    });
  }

  private buildAlertName(
    dashboardName: string,
    alertType: string,
    endpointPath: string,
  ): string {
    // Replace special chars and create valid resource name
    const cleanPath = endpointPath.replace(/[{}]/g, "");
    return `${dashboardName.replace(/\s+/g, "_")}-${alertType}-@${cleanPath}`.substring(
      0,
      80,
    );
  }

  private createAvailabilityAlert(
    scope: Construct,
    config: DashboardConfig,
    endpoint: Endpoint,
    index: number,
  ) {
    const alertName = this.buildAlertName(
      config.name,
      "availability",
      endpoint.path,
    );

    new monitorScheduledQueryRulesAlert.MonitorScheduledQueryRulesAlert(
      scope,
      `availability-alert-${index}`,
      {
        action: {
          actionGroup: config.action_groups || [],
        },
        autoMitigationEnabled: false,
        dataSourceId: config.data_source,
        description: `Availability for ${endpoint.path} is less than or equal to 99%`,
        enabled: true,
        frequency: endpoint.availabilityEvaluationFrequency || 10,
        location: config.location,
        name: alertName,
        query: buildAvailabilityQuery(endpoint, config),
        resourceGroupName: "dashboards",
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
  ) {
    const alertName = this.buildAlertName(
      config.name,
      "responsetime",
      endpoint.path,
    );

    new monitorScheduledQueryRulesAlert.MonitorScheduledQueryRulesAlert(
      scope,
      `response-time-alert-${index}`,
      {
        action: {
          actionGroup: config.action_groups || [],
        },
        autoMitigationEnabled: false,
        dataSourceId: config.data_source,
        description: `Response time for ${endpoint.path} is less than or equal to 1s`,
        enabled: true,
        frequency: endpoint.responseTimeEvaluationFrequency || 10,
        location: config.location,
        name: alertName,
        query: buildResponseTimeQuery(endpoint, config),
        resourceGroupName: "dashboards",
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
