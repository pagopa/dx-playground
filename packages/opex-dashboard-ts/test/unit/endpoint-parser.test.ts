import { parseEndpoints } from "../../src/utils/endpoint-parser";
import { OpenAPISpec } from "../../src/utils/openapi";
import { DashboardConfig } from "../../src/utils/config-validation";
import { describe, it, expect } from "vitest";

describe("parseEndpoints", () => {
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
      const endpoints = parseEndpoints(mockSpec, mockConfig);

      expect(endpoints.length).toBe(3);
      expect(endpoints.map((e) => e.path)).toEqual([
        "/users",
        "/users/{id}",
        "/posts/{postId}/comments",
      ]);
    });

    it("should apply default configuration to endpoints", () => {
      const endpoints = parseEndpoints(mockSpec, mockConfig);

      endpoints.forEach((endpoint) => {
        expect(endpoint).toHaveProperty("path");
        expect(endpoint).toHaveProperty("availabilityThreshold", 0.99); // from defaults
        expect(endpoint).toHaveProperty("responseTimeThreshold", 1); // from defaults
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
      const endpoints = parseEndpoints(mockSpec, mockConfig);

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
      const endpoints = parseEndpoints(mockSpec, mockConfig);
      expect(endpoints).toEqual([]);
    });
  });
});
