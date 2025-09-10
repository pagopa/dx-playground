import { App } from "cdktf";

import { CreateDashboardStackUseCase } from "../../application/use-cases/create-dashboard-stack-use-case.js";
import { DashboardConfig } from "../../domain/index.js";
import { EndpointParserService } from "../../domain/services/endpoint-parser-service.js";
import { ConfigValidatorAdapter } from "../config/config-validator-adapter.js";
import { OpenAPISpecResolverAdapter } from "../openapi/openapi-spec-resolver-adapter.js";
import { AzureOpexStack } from "../terraform/azure-dashboard.js";
import { TerraformStackGeneratorAdapter } from "../terraform/terraform-stack-generator-adapter.js";

/**
 * Generates Azure dashboard and alerts from configuration object.
 */
export async function addAzureDashboard({
  app,
  config,
}: {
  app: App;
  config: DashboardConfig;
}): Promise<{ opexStack: AzureOpexStack }> {
  try {
    // See https://github.com/hashicorp/terraform-cdk/pull/3876
    process.env.SYNTH_HCL_OUTPUT = "true";

    // Create adapters
    const configValidator = new ConfigValidatorAdapter();
    const openAPISpecResolver = new OpenAPISpecResolverAdapter();
    const endpointParser = new EndpointParserService();
    const terraformGenerator = new TerraformStackGeneratorAdapter();

    // Create use case
    const createDashboardStackUseCase = new CreateDashboardStackUseCase(
      configValidator,
      openAPISpecResolver,
      endpointParser,
      terraformGenerator,
    );

    // Execute use case with config object and app
    const opexStack = await createDashboardStackUseCase.execute(config, app);

    return { opexStack };
  } catch (error: unknown) {
    throw new Error(
      `Error generating dashboard: ${error instanceof Error ? error.message : "Unknown error"}`,
      { cause: error },
    );
  }
}
