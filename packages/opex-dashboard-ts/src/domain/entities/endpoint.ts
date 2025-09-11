import { z } from "zod";

// Zod schema for Endpoint
export const EndpointSchema = z.object({
  availabilityEvaluationFrequency: z.number().default(10),
  availabilityEvaluationTimeWindow: z.number().default(20),
  availabilityEventOccurrences: z.number().default(1),
  availabilityThreshold: z.number().default(0.99),
  path: z.string(),
  responseTimeEvaluationFrequency: z.number().default(10),
  responseTimeEvaluationTimeWindow: z.number().default(20),
  responseTimeEventOccurrences: z.number().default(1),
  responseTimeThreshold: z.number().default(1),
});

// Inferred types from Zod schemas
export type Endpoint = z.infer<typeof EndpointSchema>;
