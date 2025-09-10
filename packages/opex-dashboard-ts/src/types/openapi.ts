export interface OpenAPISpec {
  swagger?: string;
  openapi?: string;
  info: {
    title: string;
    version: string;
  };
  host?: string;
  basePath?: string;
  servers?: Array<{
    url: string;
  }>;
  paths: Record<string, any>;
}

export interface Endpoint {
  path: string;
  availabilityThreshold?: number;
  availabilityEvaluationFrequency?: number;
  availabilityEvaluationTimeWindow?: number;
  availabilityEventOccurrences?: number;
  responseTimeThreshold?: number;
  responseTimeEvaluationFrequency?: number;
  responseTimeEvaluationTimeWindow?: number;
  responseTimeEventOccurrences?: number;
}

export interface DashboardConfig {
  oa3_spec: string;
  name: string;
  location: string;
  resource_type?: 'app-gateway' | 'api-management';
  timespan?: string;
  evaluation_frequency?: number;
  evaluation_time_window?: number;
  event_occurrences?: number;
  data_source: string;
  action_groups?: string[];
  overrides?: {
    hosts?: string[];
    endpoints?: Record<string, Partial<Endpoint>>;
  };
  // Computed properties
  hosts?: string[];
  endpoints?: Endpoint[];
  resourceIds?: string[];
}

export interface Overrides {
  hosts?: string[];
  endpoints?: Record<string, Partial<Endpoint>>;
}
