import { MonitorScheduledQueryRulesAlert } from "@cdktf/provider-azurerm/lib/monitor-scheduled-query-rules-alert";
import { PortalDashboard } from "@cdktf/provider-azurerm/lib/portal-dashboard";
import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { TerraformStack } from "cdktf";
import { Construct } from "constructs";

import { generateDashboardProperties } from "./dashboard-generator.js";
import {
  endpointsWithDefaultProperties,
  processOpenApiFiles,
} from "./openapi-processor.js";
import {
  getApimAvailabilityQuery,
  getApimResponseTimeQuery,
} from "./query-builder.js";
import { uriToRegex } from "./uri-utils.js";

/**
 * Core configuration types for the monitoring stack
 */

export interface MonitoringConfig {
  actionGroupId: string;
  apimServiceName: string;
  location: string;
  logAnalyticsWorkspaceId: string;
  resourceGroupName: string;
  tags?: Tags;
  // New optional features for legacy compatibility and enhanced monitoring
  apiHosts?: string[];
  useLegacyFields?: boolean;
  alertSeverity?: number;
}

export interface MonitoringStackProps {
  config: MonitoringConfig;
  openApiFilePaths: string[];
}

export interface Tags {
  // Allow additional unknown properties
  [key: string]: string;
  BusinessUnit: string;
  CostCenter: string;
  CreatedBy: string;
  Environment: string;
  ManagementTeam: string;
  Scope: string;
  Source: string;
}

/**
 * Azure monitoring stack for API Management services
 * Creates alerts and dashboards based on OpenAPI specifications
 * 
 * Enhanced features:
 * - Host API filtering with KQL datatable support
 * - Legacy KQL fields compatibility (originalHost_s, requestUri_s, httpStatus_d, timeTaken_d)
 * - Configurable alert severity (defaults to Error instead of Warning)
 * - Conservative alert triggers (GreaterThanOrEqual with threshold 2)
 * - Dashboard enhancements: pie charts, scope hierarchy, visible watermarks
 * - Detailed dashboard metadata with filterLocale and time range filtering
 */
export class MonitoringStack extends TerraformStack {
  constructor(scope: Construct, id: string, props: MonitoringStackProps) {
    super(scope, id);

    const { config, openApiFilePaths } = props;

    // Configure Azure provider
    new AzurermProvider(this, "azurerm", {
      features: [{}],
      storageUseAzuread: true,
    });

    // Create resource group
    const resourceGroup = new ResourceGroup(this, "rg", {
      location: config.location,
      name: config.resourceGroupName,
    });

    // Process OpenAPI specs to extract endpoints
    const uniqueEndpoints = processOpenApiFiles(openApiFilePaths);
    const endpointsWithProps = endpointsWithDefaultProperties(uniqueEndpoints);

    // Create monitoring alerts for each endpoint
    this.createMonitoringAlerts(id, endpointsWithProps, config, resourceGroup);

    // Create monitoring dashboard
    this.createMonitoringDashboard(
      id,
      endpointsWithProps,
      config,
      resourceGroup,
    );
  }

  /**
   * Creates availability and response time alerts for all endpoints
   */
  private createMonitoringAlerts(
    id: string,
    endpoints: ReturnType<typeof endpointsWithDefaultProperties>,
    config: MonitoringStackProps["config"],
    resourceGroup: ResourceGroup,
  ): void {
    // Use configurable alert severity, defaulting to Error (1) instead of Warning (2)
    const alertSeverity = config.alertSeverity ?? 1;
    
    endpoints.forEach((endpoint) => {
      const sanitizedName = this.createSanitizedEndpointName(endpoint);
      const baseAlertName = `${id}-${sanitizedName}`;
      const endpointPath = uriToRegex(endpoint.path);

      // Create availability alert
      new MonitorScheduledQueryRulesAlert(
        this,
        `avail-alert-${sanitizedName}`,
        {
          action: { actionGroup: [config.actionGroupId] },
          dataSourceId: config.logAnalyticsWorkspaceId,
          frequency: 5,
          location: config.location,
          name: `Alert-Avail-${baseAlertName}`,
          query: getApimAvailabilityQuery({
            endpointPath,
            isAlarm: true,
            threshold: endpoint.availabilityThreshold,
            timeSpan: endpoint.availabilityTimeSpan,
            hostFilter: config.apiHosts,
            useLegacyFields: config.useLegacyFields,
          }),
          resourceGroupName: resourceGroup.name,
          severity: alertSeverity,
          tags: config.tags,
          timeWindow: 10,
          // Changed to more conservative trigger: GreaterThanOrEqual with threshold 2
          trigger: { operator: "GreaterThanOrEqual", threshold: 2 },
        },
      );

      // Create response time alert
      new MonitorScheduledQueryRulesAlert(
        this,
        `resptime-alert-${sanitizedName}`,
        {
          action: { actionGroup: [config.actionGroupId] },
          dataSourceId: config.logAnalyticsWorkspaceId,
          frequency: 5,
          location: config.location,
          name: `Alert-RespTime-${baseAlertName}`,
          query: getApimResponseTimeQuery({
            endpointPath,
            isAlarm: true,
            threshold: endpoint.responseTimeThreshold,
            timeSpan: endpoint.responseTimeTimeSpan,
            hostFilter: config.apiHosts,
            useLegacyFields: config.useLegacyFields,
          }),
          resourceGroupName: resourceGroup.name,
          severity: alertSeverity,
          tags: config.tags,
          timeWindow: 10,
          // Changed to more conservative trigger: GreaterThanOrEqual with threshold 2
          trigger: { operator: "GreaterThanOrEqual", threshold: 2 },
        },
      );
    });
  }

  /**
   * Creates a monitoring dashboard with charts for all endpoints
   */
  private createMonitoringDashboard(
    id: string,
    endpoints: ReturnType<typeof endpointsWithDefaultProperties>,
    config: MonitoringStackProps["config"],
    resourceGroup: ResourceGroup,
  ): void {
    const dashboardName = `Dashboard-${id}`;

    new PortalDashboard(this, "api-dashboard", {
      dashboardProperties: generateDashboardProperties(endpoints, config),
      location: config.location,
      name: dashboardName,
      resourceGroupName: resourceGroup.name,
      tags: { "hidden-title": dashboardName, ...config.tags },
    });
  }

  /**
   * Creates a sanitized name for an endpoint that can be used in Azure resource names
   */
  private createSanitizedEndpointName(endpoint: {
    host?: string;
    method: string;
    path: string;
  }): string {
    const hostPrefix = endpoint.host
      ? endpoint.host.replace(/[./]/g, "-") + "-"
      : "";
    const methodPrefix = endpoint.method.toLowerCase() + "-";

    return (
      hostPrefix +
      methodPrefix +
      endpoint.path.replace(/[/{}]/g, "-").replace(/^-|-$/g, "")
    );
  }
}
