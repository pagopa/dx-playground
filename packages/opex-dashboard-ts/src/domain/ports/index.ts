export interface IConfigValidator {
  validateConfig(rawConfig: unknown): ValidDashboardConfig;
}

export interface IEndpointParser {
  parseEndpoints(spec: OpenAPISpec, config: ValidDashboardConfig): Endpoint[];
}

export interface IFileReader {
  readYamlFile(filePath: string): Promise<unknown>;
}

export interface IKustoQueryGenerator {
  buildAvailabilityQuery(
    endpoint: Endpoint,
    config: ValidDashboardConfig,
  ): string;
  buildResponseCodesQuery(
    endpoint: Endpoint,
    config: ValidDashboardConfig,
  ): string;
  buildResponseTimeQuery(
    endpoint: Endpoint,
    config: ValidDashboardConfig,
  ): string;
}

export interface IOpenAPISpecResolver {
  resolve(specPath: string): Promise<OpenAPISpec>;
  resolveWithHosts(
    specPath: string,
  ): Promise<{ hosts: string[]; spec: OpenAPISpec }>;
}

export interface ITerraformFileGenerator {
  generate(config: ValidDashboardConfig): Promise<void>;
}

export interface ITerraformStackGenerator {
  generate(config: ValidDashboardConfig, app: App): Promise<AzureOpexStack>;
}

import type { App } from "cdktf";

import type { AzureOpexStack } from "../../infrastructure/terraform/azure-dashboard.js";
// Import types
import type { OpenAPISpec } from "../../shared/openapi.js";
import type { ValidDashboardConfig } from "../entities/dashboard-config.js";
import type { Endpoint } from "../entities/endpoint.js";
