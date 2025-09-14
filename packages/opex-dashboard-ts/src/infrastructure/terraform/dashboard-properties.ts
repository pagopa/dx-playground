import { Panel } from "../../domain/entities/panel.js";
import { ValidDashboardConfig } from "../../domain/index.js";
import { PanelFactory } from "../../domain/services/panel-factory.js";

export function buildDashboardPropertiesTemplate(
  config: ValidDashboardConfig,
): string {
  const factory = new PanelFactory();
  const panels = factory.buildPanels(config);
  const parts = panels
    .map((panel) => `"${panel.id}": ${serializePanel(panel, config)}`)
    .join(",");

  return `{
    "lenses": {
      "0": {
        "order": 0,
        "parts": {
          ${parts}
        }
      }
    },
    "metadata": {
      "model": {
        "timeRange": {
          "value": {
            "relative": {
              "duration": 24,
              "timeUnit": 1
            }
          },
          "type": "MsPortalFx.Composition.Configuration.ValueTypes.TimeRange"
        },
        "filterLocale": {
          "value": "en-us"
        },
        "filters": {
          "value": {
            "MsPortalFx_TimeRange": {
              "model": {
                "format": "local",
                "granularity": "auto",
                "relative": "48h"
              },
              "displayCache": {
                "name": "Local Time",
                "value": "Past 48 hours"
              },
              "filteredPartIds": [
                "StartboardPart-LogsDashboardPart-9badbd78-7607-4131-8fa1-8b85191432ed",
                "StartboardPart-LogsDashboardPart-9badbd78-7607-4131-8fa1-8b85191432ef",
                "StartboardPart-LogsDashboardPart-9badbd78-7607-4131-8fa1-8b85191432f1",
                "StartboardPart-LogsDashboardPart-9badbd78-7607-4131-8fa1-8b85191432f3",
                "StartboardPart-LogsDashboardPart-9badbd78-7607-4131-8fa1-8b85191432f5",
                "StartboardPart-LogsDashboardPart-9badbd78-7607-4131-8fa1-8b85191432f7",
                "StartboardPart-LogsDashboardPart-9badbd78-7607-4131-8fa1-8b85191432f9",
                "StartboardPart-LogsDashboardPart-9badbd78-7607-4131-8fa1-8b85191432fb",
                "StartboardPart-LogsDashboardPart-9badbd78-7607-4131-8fa1-8b85191432fd"
              ]
            }
          }
        }
      }
    }
  }`;
}

function buildInputDimensions(panel: Panel): string {
  if (panel.kind === "availability") {
    return JSON.stringify({
      aggregation: "Sum",
      splitBy: [],
      xAxis: { name: "TimeGenerated", type: "datetime" },
      yAxis: [
        { name: "availability", type: "real" },
        { name: "watermark", type: "real" },
      ],
    });
  }
  if (panel.kind === "response-codes") {
    return JSON.stringify({
      aggregation: "Sum",
      splitBy: [{ name: "HTTPStatus", type: "string" }],
      xAxis: { name: "TimeGenerated", type: "datetime" },
      yAxis: [{ name: "count_", type: "long" }],
    });
  }
  if (panel.kind === "response-time") {
    return JSON.stringify({
      aggregation: "Sum",
      splitBy: [],
      xAxis: { name: "TimeGenerated", type: "datetime" },
      yAxis: [
        { name: "duration_percentile_95", type: "real" },
        { name: "watermark", type: "long" },
      ],
    });
  }
  return "{}";
}

function buildSettingsDimensions(panel: Panel): string | undefined {
  if (panel.kind === "response-codes") {
    return JSON.stringify({
      aggregation: "Sum",
      splitBy: [{ name: "HTTPStatus", type: "string" }],
      xAxis: { name: "TimeGenerated", type: "datetime" },
      yAxis: [{ name: "count_", type: "long" }],
    });
  }
  if (panel.kind === "response-time") {
    return JSON.stringify({
      aggregation: "Sum",
      splitBy: [],
      xAxis: { name: "TimeGenerated", type: "datetime" },
      yAxis: [
        { name: "duration_percentile_95", type: "real" },
        { name: "watermark", type: "long" },
      ],
    });
  }
  return undefined;
}

function serializePanel(panel: Panel, config: ValidDashboardConfig): string {
  const resourceIds = JSON.stringify(config.resourceIds || []);
  const inputsChart = panel.chart.inputSpecificChart;
  const dimensions = buildInputDimensions(panel);
  const settingsDimensions = buildSettingsDimensions(panel);
  return `{
    "position": ${JSON.stringify(panel.position)},
    "metadata": {
      "inputs": [
        { "name": "resourceTypeMode", "isOptional": true },
        { "name": "ComponentId", "isOptional": true },
        { "name": "Scope", "value": { "resourceIds": ${resourceIds} }, "isOptional": true },
        { "name": "PartId", "isOptional": true },
        { "name": "Version", "value": "2.0", "isOptional": true },
        { "name": "TimeRange", "value": "PT4H", "isOptional": true },
        { "name": "DashboardId", "isOptional": true },
        { "name": "DraftRequestParameters", "value": { "scope": "hierarchy" }, "isOptional": true },
        { "name": "Query", "value": ${JSON.stringify(panel.query)}, "isOptional": true },
        { "name": "ControlType", "value": "FrameControlChart", "isOptional": true },
        { "name": "SpecificChart", "value": "${inputsChart}", "isOptional": true },
        { "name": "PartTitle", "value": "${panel.title}", "isOptional": true },
        { "name": "PartSubTitle", "value": "${panel.subtitle}", "isOptional": true },
        { "name": "Dimensions", "value": ${dimensions}, "isOptional": true },
        { "name": "LegendOptions", "value": { "isEnabled": true, "position": "Bottom" }, "isOptional": true },
        { "name": "IsQueryContainTimeRange", "value": false, "isOptional": true }
      ],
      "type": "Extension/Microsoft_OperationsManagementSuite_Workspace/PartType/LogsDashboardPart",
      "settings": { "content": { "Query": ${JSON.stringify(panel.query)}, ${panel.kind === "response-codes" ? '"SpecificChart": "StackedArea",' : panel.kind === "response-time" ? '"SpecificChart": "Line",' : ""} "PartTitle": "${panel.title}"${settingsDimensions ? `, "Dimensions": ${settingsDimensions}` : ""} } }
    }
  }`;
}
