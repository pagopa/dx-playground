import { EndpointParserService } from "../../src/domain/services/endpoint-parser-service.js";
import { OpenAPISpec } from "../../src/shared/openapi.js";
import { DashboardConfig } from "../../src/domain/entities/dashboard-config.js";
import { describe, it, expect } from "vitest";

describe("parseEndpoints", () => {
  const endpointParser = new EndpointParserService();
  const mockConfig: DashboardConfig = {
    oa3_spec: "/path/to/spec.yaml",
    name: "Test Dashboard",
    location: "eastus",
    data_source: "test-workspace",
    endpoints: [],
  };

  describe("with simple OpenAPI 3.0 spec", () => {
    const mockSpec: OpenAPISpec = {
      openapi: "3.0.0",
      info: { title: "Test API", version: "1.0.0" },
      servers: [{ url: "https://api.example.com" }],
      paths: {
        "/users": { get: {} } as any,
        "/users/{id}": { get: {}, put: {}, delete: {} } as any,
        "/posts/{postId}/comments": { get: {}, post: {} } as any,
      },
    } as OpenAPISpec;

    it("should parse endpoints with server URL", () => {
      const endpoints = endpointParser.parseEndpoints(mockSpec, mockConfig);

      expect(endpoints.length).toBe(3);
      expect(endpoints.map((e) => e.path)).toEqual([
        "/users",
        "/users/{id}",
        "/posts/{postId}/comments",
      ]);
    });

    it("should apply default configuration to endpoints", () => {
      const endpoints = endpointParser.parseEndpoints(mockSpec, mockConfig);

      endpoints.forEach((endpoint) => {
        expect(endpoint).toHaveProperty("path");
        expect(endpoint).toHaveProperty("availability_threshold", 0.99); // from defaults
        expect(endpoint).toHaveProperty("response_time_threshold", 1); // from defaults
      });
    });
  });

  describe("with OpenAPI 2.0 spec without servers", () => {
    const mockSpec: OpenAPISpec = {
      swagger: "2.0",
      info: { title: "Test API", version: "1.0.0" },
      host: "api.example.com",
      basePath: "/v1",
      paths: {
        "/users": { get: {} } as any,
      },
    } as OpenAPISpec;

    it("should use host and basePath", () => {
      const endpoints = endpointParser.parseEndpoints(mockSpec, mockConfig);

      expect(endpoints.length).toBe(1);
      expect(endpoints[0].path).toBe("/v1/users");
    });
  });

  describe("with empty paths", () => {
    const mockSpec: OpenAPISpec = {
      openapi: "3.0.0",
      info: { title: "Test API", version: "1.0.0" },
      servers: [{ url: "https://api.example.com" }],
      paths: {},
    } as OpenAPISpec;

    it("should return empty array", () => {
      const endpoints = endpointParser.parseEndpoints(mockSpec, mockConfig);
      expect(endpoints).toEqual([]);
    });
  });
});
