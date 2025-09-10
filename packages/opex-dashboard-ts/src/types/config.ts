import { z } from 'zod';
import { DashboardConfig, Endpoint } from './openapi';

export const DEFAULT_CONFIG: Partial<DashboardConfig> = {
  resource_type: 'app-gateway',
  timespan: '5m',
  evaluation_frequency: 10,
  evaluation_time_window: 20,
  event_occurrences: 1,
};

export const DEFAULT_ENDPOINT: Partial<Endpoint> = {
  availabilityThreshold: 0.99,
  availabilityEvaluationFrequency: 10,
  availabilityEvaluationTimeWindow: 20,
  availabilityEventOccurrences: 1,
  responseTimeThreshold: 1,
  responseTimeEvaluationFrequency: 10,
  responseTimeEvaluationTimeWindow: 20,
  responseTimeEventOccurrences: 1,
};

// Zod schema for Endpoint
const EndpointSchema = z.object({
  path: z.string(),
  availabilityThreshold: z.number().optional(),
  availabilityEvaluationFrequency: z.number().optional(),
  availabilityEvaluationTimeWindow: z.number().optional(),
  availabilityEventOccurrences: z.number().optional(),
  responseTimeThreshold: z.number().optional(),
  responseTimeEvaluationFrequency: z.number().optional(),
  responseTimeEvaluationTimeWindow: z.number().optional(),
  responseTimeEventOccurrences: z.number().optional(),
});

// Zod schema for Overrides
const OverridesSchema = z.object({
  hosts: z.array(z.string()).optional(),
  endpoints: z.record(z.string(), EndpointSchema.partial()).optional(),
}).optional();

// Zod schema for DashboardConfig
const DashboardConfigSchema = z.object({
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
  overrides: OverridesSchema,
  // Computed properties (optional in input)
  hosts: z.array(z.string()).optional(),
  endpoints: z.array(EndpointSchema).optional(),
  resourceIds: z.array(z.string()).optional(),
});

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

export function mergeEndpointWithDefaults(endpoint: Partial<Endpoint>): Endpoint {
  return {
    ...DEFAULT_ENDPOINT,
    ...endpoint,
  } as Endpoint;
}
