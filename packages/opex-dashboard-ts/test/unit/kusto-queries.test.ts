import { KustoQueryService } from "../../src/domain/services/kusto-query-service.js";
import { Endpoint } from "../../src/domain/entities/endpoint.js";
import { DashboardConfig } from "../../src/domain/entities/dashboard-config.js";
import { describe, it, expect } from "vitest";

describe("Kusto Query Generation", () => {
  const kustoQueryService = new KustoQueryService();
  const mockEndpoint: Endpoint = {
    path: "/api/users",
    availabilityThreshold: 0.99,
    availabilityEvaluationFrequency: 10,
    availabilityEvaluationTimeWindow: 20,
    availabilityEventOccurrences: 1,
    responseTimeThreshold: 1,
    responseTimeEvaluationFrequency: 10,
    responseTimeEvaluationTimeWindow: 20,
    responseTimeEventOccurrences: 1,
  };

  const mockConfig: DashboardConfig = {
    oa3_spec: "/path/to/spec.yaml",
    name: "Test Dashboard",
    location: "eastus",
    data_source: "test-workspace",
    resource_type: "app-gateway",
    timespan: "5m",
    hosts: ["api.example.com"],
    endpoints: [],
  };

  describe("buildAvailabilityQuery", () => {
    it("should generate correct availability query for app-gateway", () => {
      const query = kustoQueryService.buildAvailabilityQuery(
        mockEndpoint,
        mockConfig,
      );

      expect(query).toContain("AzureDiagnostics");
      expect(query).toContain("originalHost_s in");
      expect(query).toContain('["api.example.com"]');
      expect(query).toContain("requestUri_s matches regex");
      expect(query).toContain("httpStatus_d < 500");
      expect(query).toContain("availability=toreal(Success) / Total");
      expect(query).toContain("where availability < threshold");
      expect(query).toContain("let threshold = 0.99");
    });

    it("should generate correct availability query for api-management", () => {
      const apiConfig = {
        ...mockConfig,
        resource_type: "api-management" as const,
      };
      const query = kustoQueryService.buildAvailabilityQuery(
        mockEndpoint,
        apiConfig,
      );

      expect(query).toContain("url_s matches regex");
      expect(query).toContain("responseCode_d < 500");
      expect(query).not.toContain("originalHost_s");
    });

    it("should include time window in query", () => {
      const query = kustoQueryService.buildAvailabilityQuery(
        mockEndpoint,
        mockConfig,
      );
      expect(query).toContain("bin(TimeGenerated, 5m)");
    });
  });

  describe("buildResponseTimeQuery", () => {
    it("should generate correct response time query for app-gateway", () => {
      const query = kustoQueryService.buildResponseTimeQuery(
        mockEndpoint,
        mockConfig,
      );

      expect(query).toContain("AzureDiagnostics");
      expect(query).toContain("originalHost_s in");
      expect(query).toContain("requestUri_s matches regex");
      expect(query).toContain("timeTaken_d");
      expect(query).toContain("percentile(timeTaken_d, 95)");
      expect(query).toContain("watermark = 1");
    });

    it("should generate correct response time query for api-management", () => {
      const apiConfig = {
        ...mockConfig,
        resource_type: "api-management" as const,
      };
      const query = kustoQueryService.buildResponseTimeQuery(
        mockEndpoint,
        apiConfig,
      );

      expect(query).toContain("url_s matches regex");
      expect(query).toContain("DurationMs");
      expect(query).toContain("percentile(DurationMs, 95)");
      expect(query).not.toContain("originalHost_s");
    });

    it("should use correct response time threshold", () => {
      const customEndpoint = { ...mockEndpoint, responseTimeThreshold: 2 };
      const query = kustoQueryService.buildResponseTimeQuery(
        customEndpoint,
        mockConfig,
      );

      expect(query).toContain("watermark = 2");
    });
  });

  describe("query validation", () => {
    it("should generate valid Kusto syntax", () => {
      const availabilityQuery = kustoQueryService.buildAvailabilityQuery(
        mockEndpoint,
        mockConfig,
      );
      const responseTimeQuery = kustoQueryService.buildResponseTimeQuery(
        mockEndpoint,
        mockConfig,
      );

      // Basic syntax checks
      expect(availabilityQuery).toMatch(/^[A-Za-z]/); // Starts with letter
      expect(responseTimeQuery).toMatch(/^[A-Za-z]/); // Starts with letter
    });

    it("should handle regex escaping correctly", () => {
      const endpointWithSpecialChars = {
        ...mockEndpoint,
        path: "/api/users/{id}/posts",
      };
      const query = kustoQueryService.buildAvailabilityQuery(
        endpointWithSpecialChars,
        mockConfig,
      );

      expect(query).toContain("requestUri_s matches regex");
      expect(query).toContain("/api/users/\\{id\\}/posts");
    });
  });
});
