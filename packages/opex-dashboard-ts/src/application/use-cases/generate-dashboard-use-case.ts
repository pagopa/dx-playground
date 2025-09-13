import {
  Endpoint,
  IConfigValidator,
  IEndpointParser,
  IFileReader,
  IOpenAPISpecResolver,
  ITerraformFileGenerator,
} from "../../domain/index.js";

export class GenerateDashboardUseCase {
  constructor(
    private readonly fileReader: IFileReader,
    private readonly configValidator: IConfigValidator,
    private readonly openAPISpecResolver: IOpenAPISpecResolver,
    private readonly endpointParser: IEndpointParser,
    private readonly terraformGenerator: ITerraformFileGenerator,
  ) {}

  async execute(configFilePath: string): Promise<void> {
    // Load and parse configuration
    const rawConfig = await this.fileReader.readYamlFile(configFilePath);

    // Validate configuration
    const validatedConfig = this.configValidator.validateConfig(rawConfig);

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

    // Generate Terraform code
    await this.terraformGenerator.generate(validatedConfig);
  }
}
