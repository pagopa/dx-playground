import { z } from 'zod';
import { OpenAPISpec, isOpenAPIV2, isOpenAPIV3 } from './openapi';
import { DashboardConfig } from './config-validation';

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
export const EndpointSchema = z.object({
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

// Inferred types from Zod schemas
export type Endpoint = z.infer<typeof EndpointSchema>;

export function mergeEndpointWithDefaults(endpoint: Partial<Endpoint>): Endpoint {
  return {
    ...DEFAULT_ENDPOINT,
    ...endpoint,
  } as Endpoint;
}

export function parseEndpoints(spec: OpenAPISpec, config: DashboardConfig): Endpoint[] {
  const endpoints: Endpoint[] = [];
  const hosts = extractHosts(spec);
  const paths = Object.keys(spec.paths);

  for (const host of hosts) {
    for (const path of paths) {
      const endpointPath = buildEndpointPath(host, path, spec);
      const endpoint = mergeEndpointWithDefaults({
        path: endpointPath,
        ...getEndpointOverrides(endpointPath, config.overrides),
      });
      endpoints.push(endpoint);
    }
  }

  return endpoints;
}

function extractHosts(spec: OpenAPISpec): string[] {
  if (isOpenAPIV3(spec)) {
    // OpenAPI 3.x uses servers array
    if (spec.servers && spec.servers.length > 0) {
      return spec.servers.map(server => server.url);
    }
  } else if (isOpenAPIV2(spec)) {
    // OpenAPI 2.x uses host and basePath
    if (spec.host && spec.basePath) {
      return [`${spec.host}${spec.basePath}`];
    } else if (spec.host) {
      return [spec.host];
    }
  }
  return [];
}

function buildEndpointPath(host: string, path: string, spec: OpenAPISpec): string {
  if (host.startsWith('http')) {
    const url = new URL(host);
    return `${url.pathname}${path}`.replace(/\/+/g, '/');
  } else {
    // For OpenAPI 2.x, use basePath if available
    const basePath = isOpenAPIV2(spec) ? (spec.basePath || '') : '';
    return `${basePath}${path}`.replace(/\/+/g, '/');
  }
}

function getEndpointOverrides(endpointPath: string, overrides?: any): Partial<Endpoint> {
  if (!overrides?.endpoints) {
    return {};
  }
  return overrides.endpoints[endpointPath] || {};
}
