import { DashboardConfig } from "../entities/dashboard-config.js";
import { Endpoint } from "../entities/endpoint.js";

export class KustoQueryService {
  buildAvailabilityQuery(endpoint: Endpoint, config: DashboardConfig): string {
    const threshold = endpoint.availabilityThreshold || 0.99;
    const regex = this.uriToRegex(endpoint.path);

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
      const hosts = JSON.stringify(config.hosts || []);
      return `
let threshold = ${threshold};
AzureDiagnostics
| where originalHost_s in (${hosts})
| where requestUri_s matches regex "${regex}"
| summarize Total=count(), Success=count(httpStatus_d < 500) by bin(TimeGenerated, ${config.timespan})
| extend availability=toreal(Success) / Total
| where availability < threshold
`.trim();
    }
  }

  buildResponseCodesQuery(endpoint: Endpoint, config: DashboardConfig): string {
    const regex = this.uriToRegex(endpoint.path);

    if (config.resource_type === "api-management") {
      return `
AzureDiagnostics
| where url_s matches regex "${regex}"
| summarize count_ = count() by bin(TimeGenerated, ${config.timespan}), HTTPStatus = responseCode_d
| render timechart with (xtitle = "time", ytitle = "count")
`.trim();
    } else {
      // app-gateway version
      const hosts = JSON.stringify(config.hosts || []);
      return `
AzureDiagnostics
| where originalHost_s in (${hosts})
| where requestUri_s matches regex "${regex}")
| summarize count_ = count() by bin(TimeGenerated, ${config.timespan}), HTTPStatus = httpStatus_d
| render timechart with (xtitle = "time", ytitle = "count")
`.trim();
    }
  }

  buildResponseTimeQuery(endpoint: Endpoint, config: DashboardConfig): string {
    const threshold = endpoint.responseTimeThreshold || 1;
    const regex = this.uriToRegex(endpoint.path);

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
      const hosts = JSON.stringify(config.hosts || []);
      return `
let threshold = ${threshold};
AzureDiagnostics
| where originalHost_s in (${hosts})
| where requestUri_s matches regex "${regex}")
| summarize duration_percentile_95 = percentile(timeTaken_d, 95) by bin(TimeGenerated, ${config.timespan})
| extend watermark = ${threshold}
| render timechart with (xtitle = "time", ytitle = "duration (ms)")
`.trim();
    }
  }

  private uriToRegex(uri: string): string {
    // Convert URI path to regex pattern (same logic as Python version)
    return uri
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // Escape regex special chars
      .replace(/\\\//g, "\\/"); // Escape forward slashes
  }
}
