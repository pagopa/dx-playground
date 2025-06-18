/**
 * Query parameter types and KQL query generation functions
 */

export interface QueryParams {
  endpointPath: string;
  isAlarm: boolean;
  threshold: number;
  timeSpan: string;
}

/**
 * Generate KQL query for APIM availability monitoring
 */
export function getApimAvailabilityQuery(params: QueryParams): string {
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
}

/**
 * Generate KQL query for APIM response codes monitoring
 */
export function getApimResponseCodesQuery(params: QueryParams): string {
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
}

/**
 * Generate KQL query for APIM response time monitoring
 */
export function getApimResponseTimeQuery(params: QueryParams): string {
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
}
