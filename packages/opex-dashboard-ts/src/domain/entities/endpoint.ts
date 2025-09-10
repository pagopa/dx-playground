import { z } from "zod";

export const DEFAULT_ENDPOINT: Partial<Endpoint> = {
  availabilityEvaluationFrequency: 10,
  availabilityEvaluationTimeWindow: 20,
  availabilityEventOccurrences: 1,
  availabilityThreshold: 0.99,
  responseTimeEvaluationFrequency: 10,
  responseTimeEvaluationTimeWindow: 20,
  responseTimeEventOccurrences: 1,
  responseTimeThreshold: 1,
};

// Zod schema for Endpoint
export const EndpointSchema = z.object({
  availabilityEvaluationFrequency: z.number().optional(),
  availabilityEvaluationTimeWindow: z.number().optional(),
  availabilityEventOccurrences: z.number().optional(),
  availabilityThreshold: z.number().optional(),
  path: z.string(),
  responseTimeEvaluationFrequency: z.number().optional(),
  responseTimeEvaluationTimeWindow: z.number().optional(),
  responseTimeEventOccurrences: z.number().optional(),
  responseTimeThreshold: z.number().optional(),
});

// Inferred types from Zod schemas
export type Endpoint = z.infer<typeof EndpointSchema>;

export function mergeEndpointWithDefaults(
  endpoint: Partial<Endpoint>,
): Endpoint {
  return {
    ...DEFAULT_ENDPOINT,
    ...endpoint,
  } as Endpoint;
}
