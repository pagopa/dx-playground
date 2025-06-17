import { MonitorScheduledQueryRulesAlert } from "@cdktf/provider-azurerm/lib/monitor-scheduled-query-rules-alert";
import { PortalDashboard } from "@cdktf/provider-azurerm/lib/portal-dashboard";
import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { TerraformStack } from "cdktf";
import { Construct } from "constructs";

import * as fs from "fs";
import * as yaml from "js-yaml";

export interface Tags {
  BusinessUnit: string;
  CostCenter: string;
  CreatedBy: string;
  Environment: string;
  ManagementTeam: string;
  Scope: string;
  Source: string;
  [key: string]: string; // Allow additional unknown properties
}

export interface MonitoringConfig {
  actionGroupId: string;
  apimServiceName: string;
  location: string;
  logAnalyticsWorkspaceId: string;
  resourceGroupName: string;
  tags?: Tags;
}

export interface MonitoringStackProps {
  config: MonitoringConfig;
  openApiFilePath: string;
}

interface OpenApiSpec {
  paths: Record<string, unknown>;
}

export class MonitoringStack extends TerraformStack {
  constructor(scope: Construct, id: string, props: MonitoringStackProps) {
    super(scope, id);

    const { config, openApiFilePath } = props;

    new AzurermProvider(this, "azurerm", {
      storageUseAzuread: true,
      features: [{}]
    });

    const resourceGroup = new ResourceGroup(this, "rg", {
      location: config.location,
      name: config.resourceGroupName,
    });

    const openApiSpec = yaml.load(
      fs.readFileSync(openApiFilePath, "utf8"),
    ) as OpenApiSpec;

    const endpoints = Object.keys(openApiSpec.paths);
    const endpointsWithProps = endpoints.map((path) => ({
      availabilityThreshold: 99.0,
      path: path,
      responseTimeThreshold: 1000,
    }));

    // --- ALERTING ---
    endpointsWithProps.forEach((endpoint) => {
      const sanitizedName = endpoint.path
        .replace(/[/{}]/g, "-")
        .replace(/^-|-$/g, "");
      const baseAlertName = `${id}-${sanitizedName}`;

      new MonitorScheduledQueryRulesAlert(
        this,
        `avail-alert-${sanitizedName}`,
        {
          action: { actionGroup: [config.actionGroupId] },
          dataSourceId: config.logAnalyticsWorkspaceId,
          frequency: 5,
          location: config.location,
          name: `Alert-Avail-${baseAlertName}`,
          query: getAvailabilityQuery(
            endpoint.path,
            config.apimServiceName,
            endpoint.availabilityThreshold,
          ),
          resourceGroupName: resourceGroup.name,
          severity: 2,
          tags: config.tags,
          timeWindow: 10,
          trigger: { operator: "GreaterThan", threshold: 0 },
        },
      );

      new MonitorScheduledQueryRulesAlert(
        this,
        `resptime-alert-${sanitizedName}`,
        {
          action: { actionGroup: [config.actionGroupId] },
          dataSourceId: config.logAnalyticsWorkspaceId,
          frequency: 5,
          location: config.location,
          name: `Alert-RespTime-${baseAlertName}`,
          query: getResponseTimeQuery(
            endpoint.path,
            config.apimServiceName,
            endpoint.responseTimeThreshold,
          ),
          resourceGroupName: resourceGroup.name,
          severity: 2,
          tags: config.tags,
          timeWindow: 10,
          trigger: { operator: "GreaterThan", threshold: 0 },
        },
      );
    });

    const dashboardName = `Dashboard-${id}`;
    new PortalDashboard(this, "api-dashboard", {
      dashboardProperties: this.generateDashboardProperties(
        endpointsWithProps,
        config,
      ),
      location: config.location,
      name: dashboardName,
      resourceGroupName: resourceGroup.name,
      tags: { "hidden-title": dashboardName, ...config.tags },
    });
  }

  private createChartPart(options: {
    logAnalyticsWorkspaceId: string;
    position: { colSpan: number; rowSpan: number; x: number; y: number };
    query: string;
    specificChart: "Line" | "Pie" | "StackedArea";
    splitBy?: { name: string; type: string }[];
    subtitle: string;
    title: string;
    yAxis: { name: string; type: string }[];
  }): Record<string, unknown> {
    return {
      metadata: {
        inputs: [
          {
            name: "Scope",
            value: { resourceIds: [options.logAnalyticsWorkspaceId] },
          },
          { name: "Query", value: options.query },
          { name: "Version", value: "2.0" },
          { name: "TimeRange", value: "PT4H" },
          { name: "PartTitle", value: options.title },
          { name: "PartSubTitle", value: options.subtitle },
        ],
        settings: {
          content: {
            Dimensions: {
              aggregation: "Sum",
              splitBy: options.splitBy || [],
              xAxis: { name: "TimeGenerated", type: "datetime" },
              yAxis: options.yAxis,
            },
            LegendOptions: { isEnabled: true, position: "Bottom" },
            PartSubTitle: options.subtitle,
            PartTitle: options.title,
            Query: options.query,
            SpecificChart: options.specificChart,
          },
        },
        type: "Extension/Microsoft_OperationsManagementSuite_Workspace/PartType/LogsDashboardPart",
      },
      position: options.position,
    };
  }

  // PRIVATE METHODS TO GENERATE THE DASHBOARD
  private generateDashboardProperties(
    endpoints: {
      availabilityThreshold: number;
      path: string;
      responseTimeThreshold: number;
    }[],
    config: MonitoringConfig,
  ): string {
    const parts: Record<string, Record<string, unknown>> = {};
    endpoints.forEach((endpoint, index) => {
      const yPos = index * 4;
      const subtitle = endpoint.path;

      // Create three parts for each endpoint: Availability, Response Codes,
      // and Response Time

      // Availability Chart
      parts[index * 3 + 0] = this.createChartPart({
        logAnalyticsWorkspaceId: config.logAnalyticsWorkspaceId,
        position: { colSpan: 6, rowSpan: 4, x: 0, y: yPos },
        query: getAvailabilityQuery(
          endpoint.path,
          config.apimServiceName,
          endpoint.availabilityThreshold,
        ),
        specificChart: "Line",
        subtitle,
        title: "Availability (PT5M)",
        yAxis: [
          { name: "availability", type: "real" },
          { name: "watermark", type: "real" },
        ],
      });

      // Response Codes Chart
      parts[index * 3 + 1] = this.createChartPart({
        logAnalyticsWorkspaceId: config.logAnalyticsWorkspaceId,
        position: { colSpan: 6, rowSpan: 4, x: 6, y: yPos },
        query: getResponseCodesQuery(endpoint.path, config.apimServiceName),
        specificChart: "StackedArea",
        splitBy: [{ name: "HTTPStatus", type: "string" }],
        subtitle,
        title: "Response Codes (PT5M)",
        yAxis: [{ name: "count_", type: "long" }],
      });

      // Response Time Chart
      parts[index * 3 + 2] = this.createChartPart({
        logAnalyticsWorkspaceId: config.logAnalyticsWorkspaceId,
        position: { colSpan: 6, rowSpan: 4, x: 12, y: yPos },
        query: getResponseTimeQuery(
          endpoint.path,
          config.apimServiceName,
          endpoint.responseTimeThreshold,
        ),
        specificChart: "Line",
        subtitle,
        title: "95th Percentile Response Time (ms)",
        yAxis: [
          { name: "duration_percentile_95", type: "real" },
          { name: "watermark", type: "long" },
        ],
      });
    });

    const dashboardStructure = {
      properties: {
        lenses: { "0": { order: 0, parts: parts } },
        metadata: {
          model: {
            timeRange: {
              type: "MsPortalFx.Composition.Configuration.ValueTypes.TimeRange",
              value: { relative: { duration: 4, timeUnit: 2 } },
            },
          },
        },
      },
    };
    return JSON.stringify(dashboardStructure.properties);
  }
}

// --- FUNCTIONS FOR KQL QUERIES ---
const getAvailabilityQuery = (
  endpointPath: string,
  apimServiceName: string,
  threshold: number,
): string =>
  `let data = AzureDiagnostics | where ResourceProvider == "MICROSOFT.APIMANAGEMENT" and serviceName_s == "${apimServiceName}" and OperationName contains "${endpointPath}" | summarize count() by bin(TimeGenerated, 5m), success_ = (ResponseCode < 500); let success = data | where success_ == true | summarize success_count = sum(count_) by TimeGenerated; let failed = data | where success_ == false | summarize failed_count = sum(count_) by TimeGenerated; success | join kind=fullouter failed on TimeGenerated | project TimeGenerated, success_count, failed_count | extend success_count = iif(isempty(success_count), 0, success_count), failed_count = iif(isempty(failed_count), 0, failed_count) | extend total = success_count + failed_count | extend availability = iif(total > 0, round(success_count * 100.0 / total, 2), 100.0) | project TimeGenerated, availability, watermark = ${threshold}`;

const getResponseCodesQuery = (
  endpointPath: string,
  apimServiceName: string,
): string =>
  `AzureDiagnostics | where ResourceProvider == "MICROSOFT.APIMANAGEMENT" and serviceName_s == "${apimServiceName}" and OperationName contains "${endpointPath}" | summarize count_ = count() by bin(TimeGenerated, 5m), HTTPStatus = tostring(ResponseCode) | project TimeGenerated, HTTPStatus, count_`;

const getResponseTimeQuery = (
  endpointPath: string,
  apimServiceName: string,
  threshold: number,
): string =>
  `AzureDiagnostics | where ResourceProvider == "MICROSOFT.APIMANAGEMENT" and serviceName_s == "${apimServiceName}" and OperationName contains "${endpointPath}" | summarize duration_percentile_95 = percentile(TotalTime, 95) by bin(TimeGenerated, 5m) | project TimeGenerated, duration_percentile_95, watermark = ${threshold}`;
