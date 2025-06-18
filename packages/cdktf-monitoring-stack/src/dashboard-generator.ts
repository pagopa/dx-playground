import type { EndpointWithProperties } from "./openapi-processor.js";

import { MonitoringConfig } from "./monitoring-stack.js";
import {
  getApimAvailabilityQuery,
  getApimResponseCodesQuery,
  getApimResponseTimeQuery,
} from "./query-builder.js";
import { uriToRegex } from "./uri-utils.js";

/**
 * Dashboard chart configuration types
 */
export interface ChartOptions {
  logAnalyticsWorkspaceId: string;
  position: { colSpan: number; rowSpan: number; x: number; y: number };
  query: string;
  specificChart: "Line" | "Pie" | "StackedArea";
  splitBy?: { name: string; type: string }[];
  subtitle: string;
  title: string;
  yAxis: { name: string; type: string }[];
}

/**
 * Creates a chart part configuration for the dashboard
 */
export function createChartPart(
  options: ChartOptions,
): Record<string, unknown> {
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

/**
 * Generates dashboard properties JSON string for the Azure Portal Dashboard
 */
export function generateDashboardProperties(
  endpoints: EndpointWithProperties[],
  config: MonitoringConfig,
): string {
  const parts: Record<string, Record<string, unknown>> = {};

  endpoints.forEach((endpoint, index) => {
    const yPos = index * 4;
    const hostPath = endpoint.host
      ? `${endpoint.host}${endpoint.path}`
      : endpoint.path;
    const subtitle = `${endpoint.method} ${hostPath}`;
    const endpointPath = uriToRegex(endpoint.path);

    // Create three parts for each endpoint: Availability, Response Codes,
    // and Response Time

    // Availability Chart
    parts[index * 3 + 0] = createChartPart({
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
    parts[index * 3 + 1] = createChartPart({
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
    parts[index * 3 + 2] = createChartPart({
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
