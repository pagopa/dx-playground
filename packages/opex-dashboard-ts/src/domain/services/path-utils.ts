/* Utility functions for path placeholder normalization */

/* Convert placeholders like {serviceId} or {ServiceID} to {service_id} for display */
export function normalizePathPlaceholders(path: string): string {
  return path.replace(/\{([^}]+)\}/g, (_, name) => `{${toSnakeCase(name)}}`);
}

function toSnakeCase(input: string): string {
  return input
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[-\s]+/g, "_")
    .toLowerCase();
}
