import { App } from "cdktf";

import {
  Endpoint,
  IConfigValidator,
  IEndpointParser,
  IOpenAPISpecResolver,
  ITerraformStackGenerator,
} from "../../domain/index.js";
import { AzureOpexStack } from "../../infrastructure/terraform/azure-dashboard.js";

export class CreateDashboardStackUseCase {
  constructor(
    private readonly configValidator: IConfigValidator,
    private readonly openAPISpecResolver: IOpenAPISpecResolver,
    private readonly endpointParser: IEndpointParser,
    private readonly terraformGenerator: ITerraformStackGenerator,
  ) {}

  async execute(config: unknown, app: App): Promise<AzureOpexStack> {
    // Validate configuration
    const validatedConfig = this.configValidator.validateConfig(config);

    // Resolve OpenAPI spec and extract hosts
    const { hosts: extractedHosts, spec } =
      await this.openAPISpecResolver.resolveWithHosts(validatedConfig.oa3_spec);

    // Parse endpoints
    const endpoints: Endpoint[] = this.endpointParser.parseEndpoints(
      spec,
      validatedConfig,
    );

    // Update config with parsed data
    validatedConfig.endpoints = endpoints;
    validatedConfig.hosts = validatedConfig.overrides?.hosts || extractedHosts;
    validatedConfig.resourceIds = [validatedConfig.data_source];

    // Generate and return the stack
    return await this.terraformGenerator.generate(validatedConfig, app);
  }
}
