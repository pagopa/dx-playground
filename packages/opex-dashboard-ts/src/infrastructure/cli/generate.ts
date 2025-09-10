/* eslint-disable no-console */
import { Command } from "commander";

import { GenerateDashboardUseCase } from "../../application/index.js";
import { ConfigValidatorAdapter } from "../config/config-validator-adapter.js";
import { FileReaderAdapter } from "../file/file-reader-adapter.js";
import { OpenAPISpecResolverAdapter } from "../openapi/openapi-spec-resolver-adapter.js";
import { EndpointParserService } from "../../domain/services/endpoint-parser-service.js";
import { KustoQueryService } from "../../domain/services/kusto-query-service.js";
import { TerraformGeneratorAdapter } from "../terraform/terraform-generator-adapter.js";

export const generateCommand = new Command()
  .name("generate")
  .description("Generate dashboard definition")
  .requiredOption("-c, --config-file <file>", "YAML config file")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  .action(async (options: any) => {
    try {
      // Create adapters
      const fileReader = new FileReaderAdapter();
      const configValidator = new ConfigValidatorAdapter();
      const openAPISpecResolver = new OpenAPISpecResolverAdapter();
      const endpointParser = new EndpointParserService();
      const kustoQueryGenerator = new KustoQueryService();
      const terraformGenerator = new TerraformGeneratorAdapter();

      // Create use case
      const generateDashboardUseCase = new GenerateDashboardUseCase(
        fileReader,
        configValidator,
        openAPISpecResolver,
        endpointParser,
        kustoQueryGenerator,
        terraformGenerator,
      );

      // Execute use case
      await generateDashboardUseCase.execute(options.configFile);

      // Output result
      console.log("Terraform CDKTF code generated successfully");
    } catch (error: unknown) {
      console.error(
        "Error:",
        error instanceof Error ? error.message : "Unknown error",
        { cause: error },
      );
      process.exit(1);
    }
  });
