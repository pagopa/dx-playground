export interface IOpenAPISpecResolver {
  resolve(specPath: string): Promise<OpenAPISpec>;
}

export interface IConfigValidator {
  validateConfig(rawConfig: unknown): DashboardConfig;
}

export interface IFileReader {
  readYamlFile(filePath: string): Promise<unknown>;
}

export interface ITerraformGenerator {
  generate(config: DashboardConfig): Promise<void>;
}

export interface IEndpointParser {
  parseEndpoints(spec: OpenAPISpec, config: DashboardConfig): Endpoint[];
}

export interface IKustoQueryGenerator {
  buildAvailabilityQuery(endpoint: Endpoint, config: DashboardConfig): string;
  buildResponseCodesQuery(endpoint: Endpoint, config: DashboardConfig): string;
  buildResponseTimeQuery(endpoint: Endpoint, config: DashboardConfig): string;
}

// Import types
import type { OpenAPISpec } from "../../shared/openapi.js";
import type { DashboardConfig } from "../entities/dashboard-config.js";
import type { Endpoint } from "../entities/endpoint.js";
