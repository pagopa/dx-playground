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
    const threshold = endpoint.availability_threshold ?? 0.99;
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
| extend watermark=threshold
| project TimeGenerated, availability, watermark
| render timechart with (xtitle = "time", ytitle= "availability(%)")`;
    }
    // alert context: filtered series to fire on breaches
    return `let threshold = ${threshold};
${base}
| where availability < threshold`;
  }

  buildResponseCodesQuery(endpoint: Endpoint, config: DashboardConfig): string {
    /*
      Aggregate HTTP status into families (1XX .. 5XX) to reduce noise and align with reference dashboard.
      Anything outside the standard ranges will be bucketed as "Other".
    */
    const regex = this.createGenericRegex(endpoint.path);
    const timeBin = config.timespan;
    const codeColumn =
      config.resource_type === "api-management"
        ? "responseCode_d"
        : "httpStatus_d";
    const sourceFilter =
      config.resource_type === "api-management"
        ? `AzureDiagnostics\n| where url_s matches regex "${regex}"`
        : `${this.createHostsDataTable(config.hosts || [])}\nAzureDiagnostics\n| where originalHost_s in (api_hosts)\n| where requestUri_s matches regex "${regex}"`;

    return `${sourceFilter}
| extend HTTPStatus = case(${codeColumn} between (100 .. 199), "1XX", ${codeColumn} between (200 .. 299), "2XX", ${codeColumn} between (300 .. 399), "3XX", ${codeColumn} between (400 .. 499), "4XX", ${codeColumn} between (500 .. 599), "5XX", "Other")
| summarize count_ = count() by bin(TimeGenerated, ${timeBin}), HTTPStatus
| render timechart with (xtitle = "time", ytitle = "count")`;
  }

  buildResponseTimeQuery(
    endpoint: Endpoint,
    config: DashboardConfig,
    context: QueryContext = "alert",
  ): string {
    const threshold = endpoint.response_time_threshold ?? 1;
    const regex = this.createGenericRegex(endpoint.path);

    if (config.resource_type === "api-management") {
      if (context === "dashboard") {
        return `let threshold = ${threshold};
AzureDiagnostics
| where url_s matches regex "${regex}"
| summarize duration_percentile_95_ms = percentile(DurationMs, 95) by bin(TimeGenerated, ${config.timespan})
| extend duration_percentile_95 = duration_percentile_95_ms / 1000.0, watermark = threshold
| render timechart with (xtitle = "time", ytitle = "response time (s)")`;
      }
      return `let threshold = ${threshold};
AzureDiagnostics
| where url_s matches regex "${regex}"
| summarize duration_percentile_95_ms = percentile(DurationMs, 95) by bin(TimeGenerated, ${config.timespan})
| extend duration_percentile_95 = duration_percentile_95_ms / 1000.0
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
| summarize duration_percentile_95=percentiles(timeTaken_d, 95) by bin(TimeGenerated, ${config.timespan})
| extend watermark=threshold
| render timechart with (xtitle = "time", ytitle = "response time (s)")`;
    }
    return `let threshold = ${threshold};
${hostsDataTable}
AzureDiagnostics
| where originalHost_s in (api_hosts)
| where requestUri_s matches regex "${regex}"
| summarize duration_percentile_95=percentiles(timeTaken_d, 95) by bin(TimeGenerated, ${config.timespan})
| extend watermark=threshold
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
