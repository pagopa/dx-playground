import { z } from "zod";

import { EndpointSchema } from "./endpoint.js";

// Zod schema for DashboardConfig
export const DashboardConfigSchema = z.object({
  action_groups: z.array(z.string()).optional(),
  data_source: z.string(),
  endpoints: z.array(EndpointSchema).optional(),
  evaluation_frequency: z.number().default(10),
  evaluation_time_window: z.number().default(20),
  event_occurrences: z.number().default(1),
  // Computed properties (optional in input)
  hosts: z.array(z.string()).optional(),
  location: z.string().optional(),
  name: z.string(),
  oa3_spec: z.string(),
  overrides: z
    .object({
      endpoints: z.record(z.string(), EndpointSchema.partial()).optional(),
      hosts: z.array(z.string()).optional(),
    })
    .optional(),
  resource_group_name: z.string().default("dashboards"),
  resource_type: z
    .enum(["app-gateway", "api-management"])
    .default("app-gateway"),
  resourceIds: z.array(z.string()).optional(),
  tags: z.record(z.string(), z.string()).optional(),
  timespan: z.string().default("5m"),
});

// Fields with defaults applied can be omitted in input
export type DashboardConfig = z.input<typeof DashboardConfigSchema>;

// Inferred types from Zod schemas
export type ValidDashboardConfig = z.infer<typeof DashboardConfigSchema>;
