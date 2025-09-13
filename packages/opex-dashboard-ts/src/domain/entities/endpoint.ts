import { z } from "zod";

// Zod schema for Endpoint
export const EndpointSchema = z.object({
  availability_evaluation_frequency: z.number().default(10),
  availability_evaluation_time_window: z.number().default(20),
  availability_event_occurrences: z.number().default(1),
  availability_threshold: z.number().default(0.99),
  path: z.string(),
  response_time_evaluation_frequency: z.number().default(10),
  response_time_evaluation_time_window: z.number().default(20),
  response_time_event_occurrences: z.number().default(1),
  response_time_threshold: z.number().default(1),
});

// Inferred types from Zod schemas
export type Endpoint = z.infer<typeof EndpointSchema>;
