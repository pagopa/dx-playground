import { OpenAPISpec, Endpoint, DashboardConfig } from '../types/openapi';
import { mergeEndpointWithDefaults } from '../types/config';

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
  if (spec.servers) {
    return spec.servers.map(server => server.url);
  } else if (spec.host && spec.basePath) {
    return [`${spec.host}${spec.basePath}`];
  } else if (spec.host) {
    return [spec.host];
  }
  return [];
}

function buildEndpointPath(host: string, path: string, spec: OpenAPISpec): string {
  if (host.startsWith('http')) {
    const url = new URL(host);
    return `${url.pathname}${path}`.replace(/\/+/g, '/');
  } else {
    const basePath = spec.basePath || '';
    return `${basePath}${path}`.replace(/\/+/g, '/');
  }
}

function getEndpointOverrides(endpointPath: string, overrides?: any): Partial<Endpoint> {
  if (!overrides?.endpoints) {
    return {};
  }
  return overrides.endpoints[endpointPath] || {};
}
