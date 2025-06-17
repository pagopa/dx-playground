import { MonitorScheduledQueryRulesAlert } from "@cdktf/provider-azurerm/lib/monitor-scheduled-query-rules-alert";
import { PortalDashboard } from "@cdktf/provider-azurerm/lib/portal-dashboard";
import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { TerraformStack } from "cdktf";
import { Construct } from "constructs";
import * as fs from "fs";
import * as yaml from "js-yaml";

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
      features: [{}],
      storageUseAzuread: true,
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
      availabilityTimeSpan: "5m",
      path: path,
      responseCodeThreshold: 1000,
      responseCodeTimeSpan: "5m",
      responseTimeThreshold: 1000,
      responseTimeTimeSpan: "5m",
    }));

    // --- ALERTING ---
    endpointsWithProps.forEach((endpoint) => {
      const sanitizedName = endpoint.path
        .replace(/[/{}]/g, "-")
        .replace(/^-|-$/g, "");
      const baseAlertName = `${id}-${sanitizedName}`;

      const endpointPath = uriToRegex(endpoint.path);

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
          }),
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
          query: getApimResponseTimeQuery({
            endpointPath,
            isAlarm: true,
            threshold: endpoint.responseTimeThreshold,
            timeSpan: endpoint.responseTimeTimeSpan,
          }),
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
      availabilityTimeSpan: string;
      path: string;
      responseCodeThreshold: number;
      responseCodeTimeSpan: string;
      responseTimeThreshold: number;
      responseTimeTimeSpan: string;
    }[],
    config: MonitoringConfig,
  ): string {
    const parts: Record<string, Record<string, unknown>> = {};
    endpoints.forEach((endpoint, index) => {
      const yPos = index * 4;
      const subtitle = endpoint.path;
      const endpointPath = uriToRegex(endpoint.path);

      // Create three parts for each endpoint: Availability, Response Codes,
      // and Response Time

      // Availability Chart
      parts[index * 3 + 0] = this.createChartPart({
        logAnalyticsWorkspaceId: config.logAnalyticsWorkspaceId,
        position: { colSpan: 6, rowSpan: 4, x: 0, y: yPos },
        query: getApimAvailabilityQuery({
          endpointPath,
          isAlarm: false,
          threshold: endpoint.availabilityThreshold,
          timeSpan: endpoint.availabilityTimeSpan,
        }),
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
        query: getApimResponseCodesQuery({
          endpointPath,
          isAlarm: false,
          threshold: endpoint.responseCodeThreshold,
          timeSpan: endpoint.responseCodeTimeSpan,
        }),
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
        query: getApimResponseTimeQuery({
          endpointPath,
          isAlarm: false,
          threshold: endpoint.responseTimeThreshold,
          timeSpan: endpoint.responseTimeTimeSpan,
        }),
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
interface QueryParams {
  endpointPath: string;
  isAlarm: boolean;
  threshold: number;
  timeSpan: string;
}

const getApimAvailabilityQuery = (params: QueryParams): string => {
  const { endpointPath, isAlarm, threshold, timeSpan } = params;
  return `
  let threshold = ${threshold / 100};
  AzureDiagnostics
  | where ResourceProvider == "MICROSOFT.APIMANAGEMENT"
    and url_s matches regex "${endpointPath}"
  | summarize
    Total=count(),
    Success=count(responseCode_d < 500) by bin(TimeGenerated, ${timeSpan})
  | extend availability=toreal(Success) / Total
  ${
    isAlarm
      ? "| where availability < threshold"
      : `| project TimeGenerated, availability, watermark=threshold
   | render timechart with (xtitle = "time", ytitle= "availability(%)")`
  }
`;
};

const getApimResponseCodesQuery = (params: QueryParams): string => {
  const { endpointPath, timeSpan } = params;
  return `
  AzureDiagnostics
  | where url_s matches regex "${endpointPath}"
  | extend HTTPStatus = case(
    responseCode_d between (100 .. 199), "1XX",
    responseCode_d between (200 .. 299), "2XX",
    responseCode_d between (300 .. 399), "3XX",
    responseCode_d between (400 .. 499), "4XX",
    "5XX")
  | summarize count() by HTTPStatus, bin(TimeGenerated, ${timeSpan})
  | render areachart with (xtitle = "time", ytitle= "count")
  `;
};

const getApimResponseTimeQuery = (params: QueryParams): string => {
  const { endpointPath, isAlarm, threshold, timeSpan } = params;
  return `
  let threshold = ${threshold};
  AzureDiagnostics
  | where url_s matches regex "${endpointPath}"
  | summarize
      watermark=threshold,
      duration_percentile_95=percentiles(todouble(DurationMs)/1000, 95) by bin(TimeGenerated, ${timeSpan})
  ${
    isAlarm
      ? `| where duration_percentile_95 > threshold`
      : `| render timechart with (xtitle = "time", ytitle= "response time(s)")`
  }
  `;
};

function uriToRegex(value: string): string {
  /**
   * Translate path parameters of a URI to a generic version thanks to regex
   */
  return String(value).replace(/{[^/]+}/g, "[^/]+") + "$";
}
