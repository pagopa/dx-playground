import { ValidDashboardConfig } from "../entities/dashboard-config.js";
import { Panel } from "../entities/panel.js";
import { KustoQueryService } from "./kusto-query-service.js";
import { normalizePathPlaceholders } from "./path-utils.js";

/*
  PanelFactory converts Endpoints into a list of logical Panel models (domain) decoupled
  from Terraform/JSON serialization. This makes layout rules and future panel kinds testable
  without touching infrastructure adapters.
*/
export class PanelFactory {
  private readonly queryService = new KustoQueryService();

  buildPanels(config: ValidDashboardConfig): Panel[] {
    if (!config.endpoints) return [];

    const panels: Panel[] = [];

    config.endpoints.forEach((endpoint, idx) => {
      const rowY = idx * 4;
      // Availability
      panels.push({
        chart: { inputSpecificChart: "Line", settingsSpecificChart: "Line" },
        dimensions: {
          xAxis: { name: "TimeGenerated", type: "datetime" },
          yAxis: [
            { name: "availability", type: "real" },
            { name: "watermark", type: "real" },
          ],
        },
        id: idx * 3,
        kind: "availability",
        path: endpoint.path,
        position: { colSpan: 6, rowSpan: 4, x: 0, y: rowY },
        query: this.queryService.buildAvailabilityQuery(
          endpoint,
          config,
          "dashboard",
        ),
        subtitle: normalizePathPlaceholders(endpoint.path),
        title: `Availability (${config.timespan})`,
      });
      // Response Codes
      panels.push({
        chart: {
          inputSpecificChart: "Pie",
          settingsSpecificChart: "StackedArea",
        },
        dimensions: {
          xAxis: { name: "TimeGenerated", type: "datetime" },
          yAxis: [{ name: "count_", type: "long" }],
        },
        id: idx * 3 + 1,
        kind: "response-codes",
        path: endpoint.path,
        position: { colSpan: 6, rowSpan: 4, x: 6, y: rowY },
        query: this.queryService.buildResponseCodesQuery(endpoint, config),
        subtitle: normalizePathPlaceholders(endpoint.path),
        title: `Response Codes (${config.timespan})`,
      });
      // Response Time
      panels.push({
        chart: {
          inputSpecificChart: "StackedColumn",
          settingsSpecificChart: "Line",
        },
        dimensions: {
          xAxis: { name: "TimeGenerated", type: "datetime" },
          yAxis: [
            { name: "duration_percentile_95", type: "real" },
            { name: "watermark", type: "long" },
          ],
        },
        id: idx * 3 + 2,
        kind: "response-time",
        path: endpoint.path,
        position: { colSpan: 6, rowSpan: 4, x: 12, y: rowY },
        query: this.queryService.buildResponseTimeQuery(
          endpoint,
          config,
          "dashboard",
        ),
        subtitle: normalizePathPlaceholders(endpoint.path),
        title: `Percentile Response Time (${config.timespan})`,
      });
    });

    return panels;
  }
}
