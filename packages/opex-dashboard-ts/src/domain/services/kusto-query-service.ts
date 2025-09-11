import { DashboardConfig } from "../entities/dashboard-config.js";
import { Endpoint } from "../entities/endpoint.js";

/*
  KustoQueryService now supports two contexts:
  - "dashboard": return full time-series with watermark and render clause (no threshold filtering)
  - "alert": return filtered series (apply threshold predicate) suitable for scheduled query alerts
  Default remains "alert" to preserve existing alert generation behaviour.
*/

export type QueryContext = "alert" | "dashboard";

export class KustoQueryService {
  buildAvailabilityQuery(
    endpoint: Endpoint,
    config: DashboardConfig,
    context: QueryContext = "alert",
  ): string {
    const threshold = endpoint.availabilityThreshold || 0.99;
    const regex = this.createGenericRegex(endpoint.path);

    const base =
      config.resource_type === "api-management"
        ? `AzureDiagnostics
| where url_s matches regex "${regex}"
| summarize Total=count(), Success=count(responseCode_d < 500) by bin(TimeGenerated, ${config.timespan})
| extend availability=toreal(Success) / Total`
        : `${this.createHostsDataTable(config.hosts || [])}
AzureDiagnostics
| where originalHost_s in (api_hosts)
| where requestUri_s matches regex "${regex}"
| summarize
  Total=count(),
  Success=count(httpStatus_d < 500) by bin(TimeGenerated, ${config.timespan})
| extend availability=toreal(Success) / Total`;

    if (context === "dashboard") {
      // Keep full series with watermark line for visualization
      return `let threshold = ${threshold};
${base}
| project TimeGenerated, availability, watermark=threshold
| render timechart with (xtitle = "time", ytitle= "availability(%)")`;
    }
    // alert context: filtered series to fire on breaches
    return `let threshold = ${threshold};
${base}
| where availability < threshold`;
  }

  buildResponseCodesQuery(endpoint: Endpoint, config: DashboardConfig): string {
    // For response codes we don't filter by threshold; same query for both contexts.
    const regex = this.createGenericRegex(endpoint.path);
    if (config.resource_type === "api-management") {
      return `AzureDiagnostics
| where url_s matches regex "${regex}"
| summarize count_ = count() by bin(TimeGenerated, ${config.timespan}), HTTPStatus = responseCode_d
| render timechart with (xtitle = "time", ytitle = "count")`;
    }
    const hosts = config.hosts || [];
    const hostsDataTable = this.createHostsDataTable(hosts);
    return `${hostsDataTable}
AzureDiagnostics
| where originalHost_s in (api_hosts)
| where requestUri_s matches regex "${regex}"
| summarize count_ = count() by bin(TimeGenerated, ${config.timespan}), HTTPStatus = httpStatus_d
| render timechart with (xtitle = "time", ytitle = "count")`;
  }

  buildResponseTimeQuery(
    endpoint: Endpoint,
    config: DashboardConfig,
    context: QueryContext = "alert",
  ): string {
    const threshold = endpoint.responseTimeThreshold || 1;
    const regex = this.createGenericRegex(endpoint.path);

    if (config.resource_type === "api-management") {
      if (context === "dashboard") {
        return `let threshold = ${threshold};
AzureDiagnostics
| where url_s matches regex "${regex}"
| summarize duration_percentile_95 = percentile(DurationMs, 95) by bin(TimeGenerated, ${config.timespan})
| extend watermark = threshold
| render timechart with (xtitle = "time", ytitle = "duration (ms)")`;
      }
      return `let threshold = ${threshold};
AzureDiagnostics
| where url_s matches regex "${regex}"
| summarize duration_percentile_95 = percentile(DurationMs, 95) by bin(TimeGenerated, ${config.timespan})
| where duration_percentile_95 > threshold`;
    }

    const hosts = config.hosts || [];
    const hostsDataTable = this.createHostsDataTable(hosts);
    if (context === "dashboard") {
      return `let threshold = ${threshold};
${hostsDataTable}
AzureDiagnostics
| where originalHost_s in (api_hosts)
| where requestUri_s matches regex "${regex}"
| summarize watermark=threshold, duration_percentile_95=percentiles(timeTaken_d, 95) by bin(TimeGenerated, ${config.timespan})
| render timechart with (xtitle = "time", ytitle = "duration (ms)")`;
    }
    return `let threshold = ${threshold};
${hostsDataTable}
AzureDiagnostics
| where originalHost_s in (api_hosts)
| where requestUri_s matches regex "${regex}"
| summarize watermark=threshold, duration_percentile_95=percentiles(timeTaken_d, 95) by bin(TimeGenerated, ${config.timespan})
| where duration_percentile_95 > threshold`;
  }

  private createGenericRegex(path: string): string {
    // Convert path like "/api/v1/services/{service_id}" to "/api/v1/services/[^/]+$"
    return (
      path
        .replace(/\{[^}]+\}/g, "[^/]+") // Replace {param} with [^/]+
        .replace(/[.*?${}()|\\]/g, "\\$&") + // Escape regex special chars (but not [ ] ^ +)
      "$"
    ); // Add end anchor
  }

  private createHostsDataTable(hosts: string[]): string {
    const hostsArray = hosts.map((host) => `"${host}"`).join(", ");
    return `let api_hosts = datatable (name: string) [${hostsArray}];`;
  }
}
