import { DashboardConfig } from "../entities/dashboard-config.js";
import { Endpoint } from "../entities/endpoint.js";

export class KustoQueryService {
  buildAvailabilityQuery(endpoint: Endpoint, config: DashboardConfig): string {
    const threshold = endpoint.availabilityThreshold || 0.99;
    const regex = this.createGenericRegex(endpoint.path);

    if (config.resource_type === "api-management") {
      return `
let threshold = ${threshold};
AzureDiagnostics
| where url_s matches regex "${regex}"
| summarize Total=count(), Success=count(responseCode_d < 500) by bin(TimeGenerated, ${config.timespan})
| extend availability=toreal(Success) / Total
| where availability < threshold
`.trim();
    } else {
      const hosts = config.hosts || [];
      const hostsDataTable = this.createHostsDataTable(hosts);
      return `
${hostsDataTable}
let threshold = ${threshold};
AzureDiagnostics
| where originalHost_s in (api_hosts)
| where requestUri_s matches regex "${regex}"
| summarize
  Total=count(),
  Success=count(httpStatus_d < 500) by bin(TimeGenerated, ${config.timespan})
| extend availability=toreal(Success) / Total
| where availability < threshold
`.trim();
    }
  }

  buildResponseCodesQuery(endpoint: Endpoint, config: DashboardConfig): string {
    const regex = this.createGenericRegex(endpoint.path);

    if (config.resource_type === "api-management") {
      return `
AzureDiagnostics
| where url_s matches regex "${regex}"
| summarize count_ = count() by bin(TimeGenerated, ${config.timespan}), HTTPStatus = responseCode_d
| render timechart with (xtitle = "time", ytitle = "count")
`.trim();
    } else {
      // app-gateway version
      const hosts = config.hosts || [];
      const hostsDataTable = this.createHostsDataTable(hosts);
      return `
${hostsDataTable}
AzureDiagnostics
| where originalHost_s in (api_hosts)
| where requestUri_s matches regex "${regex}"
| summarize count_ = count() by bin(TimeGenerated, ${config.timespan}), HTTPStatus = httpStatus_d
| render timechart with (xtitle = "time", ytitle = "count")
`.trim();
    }
  }

  buildResponseTimeQuery(endpoint: Endpoint, config: DashboardConfig): string {
    const threshold = endpoint.responseTimeThreshold || 1;
    const regex = this.createGenericRegex(endpoint.path);

    if (config.resource_type === "api-management") {
      return `
let threshold = ${threshold};
AzureDiagnostics
| where url_s matches regex "${regex}"
| summarize duration_percentile_95 = percentile(DurationMs, 95) by bin(TimeGenerated, ${config.timespan})
| extend watermark = ${threshold}
| render timechart with (xtitle = "time", ytitle = "duration (ms)")
`.trim();
    } else {
      // app-gateway version
      const hosts = config.hosts || [];
      const hostsDataTable = this.createHostsDataTable(hosts);
      return `
${hostsDataTable}
let threshold = ${threshold};
AzureDiagnostics
| where originalHost_s in (api_hosts)
| where requestUri_s matches regex "${regex}"
| summarize
    watermark=threshold,
    duration_percentile_95=percentiles(timeTaken_d, 95) by bin(TimeGenerated, ${config.timespan})
| where duration_percentile_95 > threshold
`.trim();
    }
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
