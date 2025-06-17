import * as fs from "fs";
import * as yaml from "js-yaml";

/**
 * OpenAPI specification types and related data structures
 */
export interface OpenApiSpec {
  basePath?: string; // OpenAPI 2.0 base path field
  host?: string; // OpenAPI 2.0 legacy field
  paths: Record<string, Record<string, unknown>>;
  servers?: { description?: string; url: string }[]; // OpenAPI 3.x field
}

export interface EndpointDetails {
  host?: string;
  method: string;
  path: string;
}

export interface EndpointWithProperties {
  availabilityThreshold: number;
  availabilityTimeSpan: string;
  host?: string;
  method: string;
  path: string;
  responseCodeThreshold: number;
  responseCodeTimeSpan: string;
  responseTimeThreshold: number;
  responseTimeTimeSpan: string;
}

/**
 * Extract server URLs from OpenAPI spec.
 * Handles both OpenAPI 3.x servers field and OpenAPI 2.0 host + basePath fields.
 * Returns an array of host URLs (without path components for consistency).
 */
export function extractServerUrls(openApiSpec: OpenApiSpec): string[] {
  const serverUrls: string[] = [];

  // Handle OpenAPI 3.x servers field
  if (openApiSpec.servers && openApiSpec.servers.length > 0) {
    openApiSpec.servers.forEach((server) => {
      try {
        const url = new URL(server.url);
        serverUrls.push(url.host);
      } catch {
        // If URL is relative or invalid, skip it silently
      }
    });
  }

  // Fallback to OpenAPI 2.0 host field if no servers found
  if (serverUrls.length === 0 && openApiSpec.host) {
    serverUrls.push(openApiSpec.host);
  }

  return serverUrls;
}

/**
 * Extract base paths from OpenAPI spec.
 * For OpenAPI 3.x: extracts path portion from server URLs
 * For OpenAPI 2.0: extracts the basePath field
 * Returns an array of base paths.
 */
export function extractServerBasePaths(openApiSpec: OpenApiSpec): string[] {
  const basePaths: string[] = [];

  // Handle OpenAPI 3.x servers field
  if (openApiSpec.servers && openApiSpec.servers.length > 0) {
    openApiSpec.servers.forEach((server) => {
      try {
        const url = new URL(server.url);
        const pathname = url.pathname.endsWith("/")
          ? url.pathname.slice(0, -1)
          : url.pathname;
        basePaths.push(pathname || "");
      } catch {
        // If URL is relative or invalid, treat as path-only
        const pathname = server.url.startsWith("/")
          ? server.url
          : `/${server.url}`;
        basePaths.push(
          pathname.endsWith("/") ? pathname.slice(0, -1) : pathname,
        );
      }
    });
  } else {
    // Handle OpenAPI 2.0 basePath field
    const basePath = openApiSpec.basePath || "";
    basePaths.push(basePath);
  }

  return basePaths;
}

const HTTP_METHODS = [
  "delete",
  "get",
  "head",
  "options",
  "patch",
  "post",
  "put",
  "trace",
];

/**
 * Process all OpenAPI specs and collect all endpoints with their hosts and methods
 */
export function processOpenApiFiles(
  openApiFilePaths: string[],
): EndpointDetails[] {
  const allEndpointsWithDetails: EndpointDetails[] = [];

  openApiFilePaths.forEach((openApiFilePath) => {
    const openApiSpec = yaml.load(
      fs.readFileSync(openApiFilePath, "utf8"),
    ) as OpenApiSpec;

    const endpoints = extractEndpointsFromSpec(openApiSpec);
    allEndpointsWithDetails.push(...endpoints);
  });

  return removeDuplicateEndpoints(allEndpointsWithDetails);
}

/**
 * Convert endpoint details to endpoints with monitoring properties
 */
export function endpointsWithDefaultProperties(
  endpoints: EndpointDetails[],
): EndpointWithProperties[] {
  return endpoints.map((endpoint) => ({
    availabilityThreshold: 99.0,
    availabilityTimeSpan: "5m",
    host: endpoint.host,
    method: endpoint.method,
    path: endpoint.path,
    responseCodeThreshold: 1000,
    responseCodeTimeSpan: "5m",
    responseTimeThreshold: 1000,
    responseTimeTimeSpan: "5m",
  }));
}

/**
 * Extract endpoints from a single OpenAPI specification
 */
function extractEndpointsFromSpec(openApiSpec: OpenApiSpec): EndpointDetails[] {
  const endpoints: EndpointDetails[] = [];

  // Extract server URLs and base paths from the spec
  const serverUrls = extractServerUrls(openApiSpec);
  const basePaths = extractServerBasePaths(openApiSpec);

  const paths = Object.keys(openApiSpec.paths);

  paths.forEach((path) => {
    const pathItem = openApiSpec.paths[path];
    if (pathItem) {
      const methods = Object.keys(pathItem).filter((key) =>
        HTTP_METHODS.includes(key.toLowerCase()),
      );

      methods.forEach((method) => {
        // If we have server URLs, create an endpoint for each server
        if (serverUrls.length > 0 && basePaths.length > 0) {
          // For OpenAPI 3.x with servers, or OpenAPI 2.0 with host + basePath
          serverUrls.forEach((serverUrl, index) => {
            const basePath = basePaths[index] || basePaths[0] || "";
            const fullPath = basePath ? `${basePath}${path}` : path;
            endpoints.push({
              host: serverUrl,
              method: method.toUpperCase(),
              path: fullPath,
            });
          });
        } else {
          // Fallback to legacy host field or no host
          // For OpenAPI 2.0, we need to combine basePath with the path
          const fullPath = openApiSpec.basePath
            ? `${openApiSpec.basePath}${path}`
            : path;

          endpoints.push({
            host: openApiSpec.host,
            method: method.toUpperCase(),
            path: fullPath,
          });
        }
      });
    }
  });

  return endpoints;
}

/**
 * Remove duplicates based on path, method, and host combination
 */
function removeDuplicateEndpoints(
  endpoints: EndpointDetails[],
): EndpointDetails[] {
  return endpoints.filter(
    (endpoint, index, self) =>
      index ===
      self.findIndex(
        (e) =>
          e.path === endpoint.path &&
          e.method === endpoint.method &&
          e.host === endpoint.host,
      ),
  );
}
