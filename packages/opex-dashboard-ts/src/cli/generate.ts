import { Command } from 'commander';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { OA3Resolver } from '../core/resolver';
import { parseEndpoints } from '../utils/endpoint-parser';
import { validateConfig, DashboardConfig } from '../utils/config-validation';
import { AzureDashboardCdkBuilder } from '../builders/azure-dashboard-cdk';

/**
 * Generates the dashboard definition programmatically.
 * @param config - The configuration object (already parsed, not from YAML).
 * @returns The result of the dashboard build.
 */
export async function generateDashboard(config: DashboardConfig) {
  try {
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
    const builder = new AzureDashboardCdkBuilder(validatedConfig);
    const result = builder.build();

    return result;
  } catch (error: any) {
    throw new Error(`Error generating dashboard: ${error?.message || 'Unknown error'}`);
  }
}

export const generateCommand = new Command()
  .name('generate')
  .description('Generate dashboard definition')
  .requiredOption('-c, --config-file <file>', 'YAML config file')
  .action(async (options: any) => {
    try {
      // Load and parse configuration
      const configFile = fs.readFileSync(options.configFile, 'utf8');
      const rawConfig = yaml.load(configFile) as any;

      // Use the programmatic function
      const result = await generateDashboard(rawConfig);

      // Output result
      console.log('Terraform CDKTF code generated successfully');
      console.log('Run "cdktf synth" to generate Terraform files');

    } catch (error: any) {
      console.error('Error:', error?.message || 'Unknown error');
      process.exit(1);
    }
  });
