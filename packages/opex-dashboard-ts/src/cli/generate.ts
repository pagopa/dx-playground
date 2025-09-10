import { Command } from 'commander';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { OA3Resolver } from '../core/resolver';
import { parseEndpoints } from '../utils/endpoint-parser';
import { validateConfig } from '../types/config';
import { BuilderFactory, TemplateType } from '../builders/factory';

export const generateCommand = new Command()
  .name('generate')
  .description('Generate dashboard definition')
  .requiredOption('-t, --template-name <name>', 'Template name: azure-dashboard or azure-dashboard-raw')
  .requiredOption('-c, --config-file <file>', 'YAML config file')
  .action(async (options: any) => {
    try {
      // Load and parse configuration
      const configFile = fs.readFileSync(options.configFile, 'utf8');
      const rawConfig = yaml.load(configFile) as any;
      const config = validateConfig(rawConfig);

      // Resolve OpenAPI spec
      const resolver = new OA3Resolver();
      const spec = await resolver.resolve(config.oa3_spec);

      // Parse endpoints
      config.endpoints = parseEndpoints(spec, config);
      config.hosts = config.overrides?.hosts || [];
      config.resourceIds = [config.data_source];

      // Create and run builder
      const builder = BuilderFactory.createBuilder(options.templateName as TemplateType, config);
      const result = builder.build();

      // Output result
      if (options.templateName === 'azure-dashboard-raw') {
        console.log(result);
      } else {
        console.log('Terraform CDKTF code generated successfully');
        console.log('Run "cdktf synth" to generate Terraform files');
      }

    } catch (error: any) {
      console.error('Error:', error?.message || 'Unknown error');
      process.exit(1);
    }
  });
