export interface IConfigValidator {
  validateConfig(rawConfig: unknown): DashboardConfig;
}

export interface IEndpointParser {
  parseEndpoints(spec: OpenAPISpec, config: DashboardConfig): Endpoint[];
}

export interface IFileReader {
  readYamlFile(filePath: string): Promise<unknown>;
}

export interface IKustoQueryGenerator {
  buildAvailabilityQuery(endpoint: Endpoint, config: DashboardConfig): string;
  buildResponseCodesQuery(endpoint: Endpoint, config: DashboardConfig): string;
  buildResponseTimeQuery(endpoint: Endpoint, config: DashboardConfig): string;
}

export interface IOpenAPISpecResolver {
  resolve(specPath: string): Promise<OpenAPISpec>;
  resolveWithHosts(
    specPath: string,
  ): Promise<{ hosts: string[]; spec: OpenAPISpec }>;
}

export interface ITerraformFileGenerator {
  generate(config: DashboardConfig): Promise<void>;
}

export interface ITerraformStackGenerator {
  generate(config: DashboardConfig, app: App): Promise<AzureOpexStack>;
}

import type { App } from "cdktf";

import type { AzureOpexStack } from "../../infrastructure/terraform/azure-dashboard.js";
// Import types
import type { OpenAPISpec } from "../../shared/openapi.js";
import type { DashboardConfig } from "../entities/dashboard-config.js";
import type { Endpoint } from "../entities/endpoint.js";
