import { Construct } from 'constructs';
import { monitorScheduledQueryRulesAlert } from '@cdktf/provider-azurerm';
import { DashboardConfig, Endpoint } from '../types/openapi';
import { buildAvailabilityQuery, buildResponseTimeQuery } from '../core/kusto-queries';

export class AzureAlertsConstruct {
  constructor(scope: Construct, config: DashboardConfig) {
    if (!config.endpoints) return;

    config.endpoints.forEach((endpoint, index) => {
      this.createAvailabilityAlert(scope, config, endpoint, index);
      this.createResponseTimeAlert(scope, config, endpoint, index);
    });
  }

  private createAvailabilityAlert(scope: Construct, config: DashboardConfig, endpoint: Endpoint, index: number) {
    const alertName = this.buildAlertName(config.name, 'availability', endpoint.path);

    new monitorScheduledQueryRulesAlert.MonitorScheduledQueryRulesAlert(scope, `availability-alert-${index}`, {
      name: alertName,
      resourceGroupName: 'dashboards', // Same as Python version
      location: config.location,
      action: {
        actionGroup: config.action_groups || []
      },
      dataSourceId: config.data_source,
      description: `Availability for ${endpoint.path} is less than or equal to 99%`,
      enabled: true,
      autoMitigationEnabled: false,
      query: buildAvailabilityQuery(endpoint, config),
      severity: 1, // Same as Python version
      frequency: endpoint.availabilityEvaluationFrequency || 10,
      timeWindow: endpoint.availabilityEvaluationTimeWindow || 20,
      trigger: {
        operator: 'GreaterThanOrEqual',
        threshold: endpoint.availabilityEventOccurrences || 1
      }
    });
  }

  private createResponseTimeAlert(scope: Construct, config: DashboardConfig, endpoint: Endpoint, index: number) {
    const alertName = this.buildAlertName(config.name, 'responsetime', endpoint.path);

    new monitorScheduledQueryRulesAlert.MonitorScheduledQueryRulesAlert(scope, `response-time-alert-${index}`, {
      name: alertName,
      resourceGroupName: 'dashboards', // Same as Python version
      location: config.location,
      action: {
        actionGroup: config.action_groups || []
      },
      dataSourceId: config.data_source,
      description: `Response time for ${endpoint.path} is less than or equal to 1s`,
      enabled: true,
      autoMitigationEnabled: false,
      query: buildResponseTimeQuery(endpoint, config),
      severity: 1, // Same as Python version
      frequency: endpoint.responseTimeEvaluationFrequency || 10,
      timeWindow: endpoint.responseTimeEvaluationTimeWindow || 20,
      trigger: {
        operator: 'GreaterThanOrEqual',
        threshold: endpoint.responseTimeEventOccurrences || 1
      }
    });
  }

  private buildAlertName(dashboardName: string, alertType: string, endpointPath: string): string {
    // Same logic as Python version: replace special chars and create valid resource name
    const cleanPath = endpointPath.replace(/[{}]/g, '');
    return `${dashboardName.replace(/\s+/g, '_')}-${alertType}-@${cleanPath}`.substring(0, 80);
  }
}
