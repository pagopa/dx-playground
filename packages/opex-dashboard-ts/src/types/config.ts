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
