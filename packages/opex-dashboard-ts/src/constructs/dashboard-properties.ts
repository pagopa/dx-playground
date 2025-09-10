import { DashboardConfig } from "../utils/config-validation";
import { Endpoint } from "../utils/endpoint-parser";
import {
  buildAvailabilityQuery,
  buildResponseCodesQuery,
  buildResponseTimeQuery,
} from "../core/kusto-queries";

export function buildDashboardPropertiesTemplate(
  config: DashboardConfig,
): string {
  const parts = config.endpoints
    ?.map((endpoint, index) => {
      const baseIndex = index * 3;
      return `
"${baseIndex}": ${buildAvailabilityPart(endpoint, config, baseIndex)},
"${baseIndex + 1}": ${buildResponseCodesPart(endpoint, config, baseIndex + 1)},
"${baseIndex + 2}": ${buildResponseTimePart(endpoint, config, baseIndex + 2)}`;
    })
    .join(",");

  return `{
  "properties": {
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
  },
  "name": "${config.name}",
  "type": "Microsoft.Portal/dashboards",
  "location": "${config.location}",
  "tags": {
    "hidden-title": "${config.name}"
  },
  "apiVersion": "2015-08-01-preview"
}`;
}

function buildAvailabilityPart(
  endpoint: Endpoint,
  config: DashboardConfig,
  partId: number,
): string {
  const query = buildAvailabilityQuery(endpoint, config);
  const resourceIds = JSON.stringify(config.resourceIds || []);

  return `{
    "position": {
      "x": 0,
      "y": ${Math.floor(partId / 3) * 4},
      "colSpan": 6,
      "rowSpan": 4
    },
    "metadata": {
      "inputs": [
        {
          "name": "resourceTypeMode",
          "isOptional": true
        },
        {
          "name": "ComponentId",
          "isOptional": true
        },
        {
          "name": "Scope",
          "value": {
            "resourceIds": ${resourceIds}
          },
          "isOptional": true
        },
        {
          "name": "PartId",
          "isOptional": true
        },
        {
          "name": "Version",
          "value": "2.0",
          "isOptional": true
        },
        {
          "name": "TimeRange",
          "value": "PT4H",
          "isOptional": true
        },
        {
          "name": "DashboardId",
          "isOptional": true
        },
        {
          "name": "DraftRequestParameters",
          "value": {
            "scope": "hierarchy"
          },
          "isOptional": true
        },
        {
          "name": "Query",
          "value": ${JSON.stringify(query)},
          "isOptional": true
        },
        {
          "name": "ControlType",
          "value": "FrameControlChart",
          "isOptional": true
        },
        {
          "name": "SpecificChart",
          "value": "Line",
          "isOptional": true
        },
        {
          "name": "PartTitle",
          "value": "Availability (${config.timespan})",
          "isOptional": true
        },
        {
          "name": "PartSubTitle",
          "value": "${endpoint.path}",
          "isOptional": true
        },
        {
          "name": "Dimensions",
          "value": {
            "xAxis": {
              "name": "TimeGenerated",
              "type": "datetime"
            },
            "yAxis": [
              {
                "name": "availability",
                "type": "real"
              },
              {
                "name": "watermark",
                "type": "real"
              }
            ],
            "splitBy": [],
            "aggregation": "Sum"
          },
          "isOptional": true
        },
        {
          "name": "LegendOptions",
          "value": {
            "isEnabled": true,
            "position": "Bottom"
          },
          "isOptional": true
        },
        {
          "name": "IsQueryContainTimeRange",
          "value": false,
          "isOptional": true
        }
      ],
      "type": "Extension/Microsoft_OperationsManagementSuite_Workspace/PartType/LogsDashboardPart",
      "settings": {
        "content": {
          "Query": ${JSON.stringify(query)},
          "PartTitle": "Availability (${config.timespan})"
        }
      }
    }
  }`;
}

function buildResponseCodesPart(
  endpoint: Endpoint,
  config: DashboardConfig,
  partId: number,
): string {
  const query = buildResponseCodesQuery(endpoint, config);
  const resourceIds = JSON.stringify(config.resourceIds || []);

  return `{
    "position": {
      "x": 6,
      "y": ${Math.floor(partId / 3) * 4},
      "colSpan": 6,
      "rowSpan": 4
    },
    "metadata": {
      "inputs": [
        {
          "name": "resourceTypeMode",
          "isOptional": true
        },
        {
          "name": "ComponentId",
          "isOptional": true
        },
        {
          "name": "Scope",
          "value": {
            "resourceIds": ${resourceIds}
          },
          "isOptional": true
        },
        {
          "name": "PartId",
          "isOptional": true
        },
        {
          "name": "Version",
          "value": "2.0",
          "isOptional": true
        },
        {
          "name": "TimeRange",
          "value": "PT4H",
          "isOptional": true
        },
        {
          "name": "DashboardId",
          "isOptional": true
        },
        {
          "name": "DraftRequestParameters",
          "value": {
            "scope": "hierarchy"
          },
          "isOptional": true
        },
        {
          "name": "Query",
          "value": ${JSON.stringify(query)},
          "isOptional": true
        },
        {
          "name": "ControlType",
          "value": "FrameControlChart",
          "isOptional": true
        },
        {
          "name": "SpecificChart",
          "value": "Pie",
          "isOptional": true
        },
        {
          "name": "PartTitle",
          "value": "Response Codes (${config.timespan})",
          "isOptional": true
        },
        {
          "name": "PartSubTitle",
          "value": "${endpoint.path}",
          "isOptional": true
        },
        {
          "name": "Dimensions",
          "value": {
            "xAxis": {
              "name": "${config.resource_type === "api-management" ? "responseCode_d" : "httpStatus_d"}",
              "type": "string"
            },
            "yAxis": [
              {
                "name": "count_",
                "type": "long"
              }
            ],
            "splitBy": [],
            "aggregation": "Sum"
          },
          "isOptional": true
        },
        {
          "name": "LegendOptions",
          "value": {
            "isEnabled": true,
            "position": "Bottom"
          },
          "isOptional": true
        },
        {
          "name": "IsQueryContainTimeRange",
          "value": false,
          "isOptional": true
        }
      ],
      "type": "Extension/Microsoft_OperationsManagementSuite_Workspace/PartType/LogsDashboardPart",
      "settings": {
        "content": {
          "Query": ${JSON.stringify(query)},
          "SpecificChart": "StackedArea",
          "PartTitle": "Response Codes (${config.timespan})",
          "Dimensions": {
            "xAxis": {
              "name": "TimeGenerated",
              "type": "datetime"
            },
            "yAxis": [
              {
                "name": "count_",
                "type": "long"
              }
            ],
            "splitBy": [
              {
                "name": "${config.resource_type === "api-management" ? "HTTPStatus" : "HTTPStatus"}",
                "type": "string"
              }
            ],
            "aggregation": "Sum"
          }
        }
      }
    }
  }`;
}

function buildResponseTimePart(
  endpoint: Endpoint,
  config: DashboardConfig,
  partId: number,
): string {
  const query = buildResponseTimeQuery(endpoint, config);
  const resourceIds = JSON.stringify(config.resourceIds || []);

  return `{
    "position": {
      "x": 12,
      "y": ${Math.floor(partId / 3) * 4},
      "colSpan": 6,
      "rowSpan": 4
    },
    "metadata": {
      "inputs": [
        {
          "name": "resourceTypeMode",
          "isOptional": true
        },
        {
          "name": "ComponentId",
          "isOptional": true
        },
        {
          "name": "Scope",
          "value": {
            "resourceIds": ${resourceIds}
          },
          "isOptional": true
        },
        {
          "name": "PartId",
          "isOptional": true
        },
        {
          "name": "Version",
          "value": "2.0",
          "isOptional": true
        },
        {
          "name": "TimeRange",
          "value": "PT4H",
          "isOptional": true
        },
        {
          "name": "DashboardId",
          "isOptional": true
        },
        {
          "name": "DraftRequestParameters",
          "value": {
            "scope": "hierarchy"
          },
          "isOptional": true
        },
        {
          "name": "Query",
          "value": ${JSON.stringify(query)},
          "isOptional": true
        },
        {
          "name": "ControlType",
          "value": "FrameControlChart",
          "isOptional": true
        },
        {
          "name": "SpecificChart",
          "value": "StackedColumn",
          "isOptional": true
        },
        {
          "name": "PartTitle",
          "value": "Percentile Response Time (${config.timespan})",
          "isOptional": true
        },
        {
          "name": "PartSubTitle",
          "value": "${endpoint.path}",
          "isOptional": true
        },
        {
          "name": "Dimensions",
          "value": {
            "xAxis": {
              "name": "TimeGenerated",
              "type": "datetime"
            },
            "yAxis": [
              {
                "name": "duration_percentile_95",
                "type": "real"
              }
            ],
            "splitBy": [],
            "aggregation": "Sum"
          },
          "isOptional": true
        },
        {
          "name": "LegendOptions",
          "value": {
            "isEnabled": true,
            "position": "Bottom"
          },
          "isOptional": true
        },
        {
          "name": "IsQueryContainTimeRange",
          "value": false,
          "isOptional": true
        }
      ],
      "type": "Extension/Microsoft_OperationsManagementSuite_Workspace/PartType/LogsDashboardPart",
      "settings": {
        "content": {
          "Query": ${JSON.stringify(query)},
          "SpecificChart": "Line",
          "PartTitle": "Percentile Response Time (${config.timespan})",
          "Dimensions": {
            "xAxis": {
              "name": "TimeGenerated",
              "type": "datetime"
            },
            "yAxis": [
              {
                "name": "watermark",
                "type": "long"
              },
              {
                "name": "duration_percentile_95",
                "type": "real"
              }
            ],
            "splitBy": [],
            "aggregation": "Sum"
          }
        }
      }
    }
  }`;
}
