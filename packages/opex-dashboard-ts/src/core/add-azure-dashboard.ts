import { App } from "cdktf";
import { AzureOpexStack } from "../constructs/azure-dashboard.js";
import { DashboardConfig, validateConfig } from "../utils/config-validation.js";
import { parseEndpoints } from "../utils/endpoint-parser.js";
import { OA3Resolver } from "./resolver.js";

/**
 * Add the dashboard definition to the provided App (stacks).
 */
export async function addAzureDashboard({
  config,
  app,
}: {
  config: DashboardConfig;
  app: App;
}): Promise<{ opexStack: AzureOpexStack }> {
  try {
    // See https://github.com/hashicorp/terraform-cdk/pull/3876
    if (app.hclOutput) {
      process.env.SYNTH_HCL_OUTPUT = "true";
    }
    // Validate configuration
    const validatedConfig = validateConfig(config);

    // Resolve OpenAPI spec
    const resolver = new OA3Resolver();
    const spec = await resolver.resolve(validatedConfig.oa3_spec);

    // Parse endpoints
    validatedConfig.endpoints = parseEndpoints(spec, validatedConfig);
    validatedConfig.hosts = validatedConfig.overrides?.hosts || [];
    validatedConfig.resourceIds = [validatedConfig.data_source];

    // Create and run builder
    // Create the main stack with dashboard and alerts
    const opexStack = new AzureOpexStack(
      app,
      "opex-dashboard",
      validatedConfig,
    );

    return { opexStack };
  } catch (error: unknown) {
    throw new Error(
      `Error generating dashboard: ${error instanceof Error ? error.message : "Unknown error"}`,
      { cause: error },
    );
  }
}
