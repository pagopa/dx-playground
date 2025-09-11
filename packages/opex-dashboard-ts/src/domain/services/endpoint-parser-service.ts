import { isOpenAPIV2, isOpenAPIV3, OpenAPISpec } from "../../shared/openapi.js";
import { DashboardConfig } from "../entities/dashboard-config.js";
import { Endpoint, EndpointSchema } from "../entities/endpoint.js";

export class EndpointParserService {
  parseEndpoints(spec: OpenAPISpec, config: DashboardConfig): Endpoint[] {
    const endpoints: Endpoint[] = [];
    const hosts = this.extractHosts(spec);
    const paths = Object.keys(spec.paths);

    for (const host of hosts) {
      for (const path of paths) {
        const endpointPath = this.buildEndpointPath(host, path, spec);
        const endpoint = EndpointSchema.parse({
          path: endpointPath,
          ...this.getEndpointOverrides(endpointPath, config.overrides),
        });
        endpoints.push(endpoint);
      }
    }

    return endpoints;
  }

  private buildEndpointPath(
    host: string,
    path: string,
    spec: OpenAPISpec,
  ): string {
    if (host.startsWith("http")) {
      const url = new URL(host);
      return `${url.pathname}${path}`.replace(/\/+/g, "/");
    } else {
      // For OpenAPI 2.x, use basePath if available
      const basePath = isOpenAPIV2(spec) ? spec.basePath || "" : "";
      return `${basePath}${path}`.replace(/\/+/g, "/");
    }
  }

  private extractHosts(spec: OpenAPISpec): string[] {
    if (isOpenAPIV3(spec)) {
      // OpenAPI 3.x uses servers array
      if (spec.servers && spec.servers.length > 0) {
        return spec.servers.map((server) => server.url);
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

  private getEndpointOverrides(
    endpointPath: string,
    overrides?: DashboardConfig["overrides"],
  ): Partial<Endpoint> {
    if (!overrides?.endpoints) {
      return {};
    }
    return overrides.endpoints[endpointPath] || {};
  }
}
