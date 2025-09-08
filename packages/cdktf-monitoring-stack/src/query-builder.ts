/**
 * Query parameter types and KQL query generation functions
 */

export interface QueryParams {
  endpointPath: string;
  isAlarm: boolean;
  threshold: number;
  timeSpan: string;
  // New optional parameters for enhanced functionality
  hostFilter?: string[];
  useLegacyFields?: boolean;
}

/**
 * Generate KQL query for APIM availability monitoring
 */
export function getApimAvailabilityQuery(params: QueryParams): string {
  const { endpointPath, isAlarm, threshold, timeSpan, hostFilter, useLegacyFields } = params;
  
  // Generate host filtering datatable if provided
  const hostFilterQuery = hostFilter && hostFilter.length > 0 
    ? `let api_hosts = datatable (name: string) [${hostFilter.map(host => `"${host}"`).join(", ")}];\n  `
    : "";
  
  // Choose field names based on legacy flag
  const urlField = useLegacyFields ? "requestUri_s" : "url_s";
  const hostField = useLegacyFields ? "originalHost_s" : "url_s";
  const statusField = useLegacyFields ? "httpStatus_d" : "responseCode_d";
  
  // Add host filtering condition if hosts are specified
  const hostCondition = hostFilter && hostFilter.length > 0
    ? `and ${hostField} in (api_hosts)\n    `
    : "";
  
  return `
  ${hostFilterQuery}let threshold = ${threshold / 100};
  AzureDiagnostics
  | where ResourceProvider == "MICROSOFT.APIMANAGEMENT"
    and ${urlField} matches regex "${endpointPath}"
    ${hostCondition}| summarize
    Total=count(),
    Success=count(${statusField} < 500) by bin(TimeGenerated, ${timeSpan})
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
  const { endpointPath, timeSpan, hostFilter, useLegacyFields } = params;
  
  // Generate host filtering datatable if provided
  const hostFilterQuery = hostFilter && hostFilter.length > 0 
    ? `let api_hosts = datatable (name: string) [${hostFilter.map(host => `"${host}"`).join(", ")}];\n  `
    : "";
  
  // Choose field names based on legacy flag
  const urlField = useLegacyFields ? "requestUri_s" : "url_s";
  const hostField = useLegacyFields ? "originalHost_s" : "url_s";
  const statusField = useLegacyFields ? "httpStatus_d" : "responseCode_d";
  
  // Add host filtering condition if hosts are specified
  const hostCondition = hostFilter && hostFilter.length > 0
    ? `and ${hostField} in (api_hosts)\n  `
    : "";
  
  return `
  ${hostFilterQuery}AzureDiagnostics
  | where ${urlField} matches regex "${endpointPath}"
  ${hostCondition}| extend HTTPStatus = case(
    ${statusField} between (100 .. 199), "1XX",
    ${statusField} between (200 .. 299), "2XX",
    ${statusField} between (300 .. 399), "3XX",
    ${statusField} between (400 .. 499), "4XX",
    "5XX")
  | summarize count() by HTTPStatus, bin(TimeGenerated, ${timeSpan})
  | render areachart with (xtitle = "time", ytitle= "count")
  `;
}

/**
 * Generate KQL query for APIM response time monitoring
 */
export function getApimResponseTimeQuery(params: QueryParams): string {
  const { endpointPath, isAlarm, threshold, timeSpan, hostFilter, useLegacyFields } = params;
  
  // Generate host filtering datatable if provided
  const hostFilterQuery = hostFilter && hostFilter.length > 0 
    ? `let api_hosts = datatable (name: string) [${hostFilter.map(host => `"${host}"`).join(", ")}];\n  `
    : "";
  
  // Choose field names based on legacy flag
  const urlField = useLegacyFields ? "requestUri_s" : "url_s";
  const hostField = useLegacyFields ? "originalHost_s" : "url_s";
  const durationField = useLegacyFields ? "timeTaken_d" : "DurationMs";
  const durationConversion = useLegacyFields ? "timeTaken_d/1000" : "todouble(DurationMs)/1000";
  
  // Add host filtering condition if hosts are specified
  const hostCondition = hostFilter && hostFilter.length > 0
    ? `and ${hostField} in (api_hosts)\n  `
    : "";
  
  return `
  ${hostFilterQuery}let threshold = ${threshold};
  AzureDiagnostics
  | where ${urlField} matches regex "${endpointPath}"
  ${hostCondition}| summarize
      watermark=threshold,
      duration_percentile_95=percentiles(${durationConversion}, 95) by bin(TimeGenerated, ${timeSpan})
  ${
    isAlarm
      ? `| where duration_percentile_95 > threshold`
      : `| render timechart with (xtitle = "time", ytitle= "response time(s)", watermark=threshold)`
  }
  `;
}
