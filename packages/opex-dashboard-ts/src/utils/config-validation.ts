import { z } from "zod";

import { EndpointSchema } from "./endpoint-parser.js";

export const DEFAULT_CONFIG: Partial<DashboardConfig> = {
  evaluation_frequency: 10,
  evaluation_time_window: 20,
  event_occurrences: 1,
  resource_type: "app-gateway",
  timespan: "5m",
};

// Zod schema for DashboardConfig
export const DashboardConfigSchema = z.object({
  action_groups: z.array(z.string()).optional(),
  data_source: z.string(),
  endpoints: z.array(EndpointSchema).optional(),
  evaluation_frequency: z.number().optional(),
  evaluation_time_window: z.number().optional(),
  event_occurrences: z.number().optional(),
  // Computed properties (optional in input)
  hosts: z.array(z.string()).optional(),
  location: z.string(),
  name: z.string(),
  oa3_spec: z.string(),
  overrides: z
    .object({
      endpoints: z.record(z.string(), EndpointSchema.partial()).optional(),
      hosts: z.array(z.string()).optional(),
    })
    .optional(),
  resource_type: z.enum(["app-gateway", "api-management"]).optional(),
  resourceIds: z.array(z.string()).optional(),
  timespan: z.string().optional(),
});

// Inferred types from Zod schemas
export type DashboardConfig = z.infer<typeof DashboardConfigSchema>;

export function mergeConfigWithDefaults(
  config: Partial<DashboardConfig>,
): DashboardConfig {
  return {
    ...DEFAULT_CONFIG,
    ...config,
  } as DashboardConfig;
}

export function validateConfig(rawConfig: unknown): DashboardConfig {
  // Parse and validate with zod using safeParse
  const result = DashboardConfigSchema.safeParse(rawConfig);

  if (!result.success) {
    // Format validation errors
    const errorMessage = result.error.issues
      .map((err) => `• ${err.path.join(".")}: ${err.message}`)
      .join("\n");
    throw new Error(`Configuration validation failed:\n${errorMessage}`);
  }

  // Apply defaults
  return {
    ...DEFAULT_CONFIG,
    ...result.data,
  };
}
