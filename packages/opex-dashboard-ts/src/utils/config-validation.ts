import { z } from 'zod';
import { Endpoint } from './endpoint-parser';
import { EndpointSchema } from './endpoint-parser';

export const DEFAULT_CONFIG: Partial<DashboardConfig> = {
  resource_type: 'app-gateway',
  timespan: '5m',
  evaluation_frequency: 10,
  evaluation_time_window: 20,
  event_occurrences: 1,
};

// Zod schema for DashboardConfig
export const DashboardConfigSchema = z.object({
  oa3_spec: z.string(),
  name: z.string(),
  location: z.string(),
  resource_type: z.enum(['app-gateway', 'api-management']).optional(),
  timespan: z.string().optional(),
  evaluation_frequency: z.number().optional(),
  evaluation_time_window: z.number().optional(),
  event_occurrences: z.number().optional(),
  data_source: z.string(),
  action_groups: z.array(z.string()).optional(),
  overrides: z.object({
    hosts: z.array(z.string()).optional(),
    endpoints: z.record(z.string(), EndpointSchema.partial()).optional(),
  }).optional(),
  // Computed properties (optional in input)
  hosts: z.array(z.string()).optional(),
  endpoints: z.array(EndpointSchema).optional(),
  resourceIds: z.array(z.string()).optional(),
});

// Inferred types from Zod schemas
export type DashboardConfig = z.infer<typeof DashboardConfigSchema>;

export function validateConfig(rawConfig: any): DashboardConfig {
  // Parse and validate with zod using safeParse
  const result = DashboardConfigSchema.safeParse(rawConfig);

  if (!result.success) {
    // Format validation errors
    const errorMessage = result.error.issues
      .map((err: any) => `• ${err.path.join('.')}: ${err.message}`)
      .join('\n');
    throw new Error(`Configuration validation failed:\n${errorMessage}`);
  }

  // Apply defaults
  return {
    ...DEFAULT_CONFIG,
    ...result.data,
  };
}

export function mergeConfigWithDefaults(config: any): DashboardConfig {
  return {
    ...DEFAULT_CONFIG,
    ...config,
  } as DashboardConfig;
}
