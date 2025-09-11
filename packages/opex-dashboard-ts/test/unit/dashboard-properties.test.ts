import { describe, it, expect } from "vitest";
import { buildDashboardPropertiesTemplate } from "../../src/infrastructure/terraform/dashboard-properties.js";
import { DashboardConfig, Endpoint } from "../../src/domain/index.js";

/*
  Snapshot-style test to ensure dashboard queries (availability & response time) contain
  full time-series (render clause + watermark) and do NOT include alert-only filters.
*/

describe("dashboard properties template", () => {
  const endpoint: Endpoint = {
    path: "/api/v1/services/{service_id}",
    availabilityThreshold: 0.99,
    responseTimeThreshold: 1,
  } as Endpoint;

  const config: DashboardConfig = {
    oa3_spec: "spec.yaml",
    name: "Demo Dashboard",
    location: "westeurope",
    data_source: "workspace-id",
    resource_type: "app-gateway",
    timespan: "5m",
    resourceGroupName: "rg-demo",
    resourceIds: [
      "/subscriptions/xxxx/resourceGroups/rg-demo/providers/Microsoft.Network/applicationGateways/gtw-demo",
    ],
    hosts: ["app-backend.io.italia.it"],
    endpoints: [endpoint],
  } as unknown as DashboardConfig;

  it("generates dashboard JSON with full-series availability & response time queries", () => {
    const json = buildDashboardPropertiesTemplate(config);

    // Availability: should have render + watermark projection; no threshold filter line
    expect(json).toContain("availability(%)");
    expect(json).toContain("watermark");
    expect(json).not.toContain("where availability < threshold");

    // Response time: dashboard variant renders chart, not filtered by threshold
    expect(json).toContain("duration (ms)");
    expect(json).not.toContain("where duration_percentile_95 > threshold");

    // Regex expansion check
    expect(json).toContain("/api/v1/services/[^/]+$");
  });
});
