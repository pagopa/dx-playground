/**
 * URI transformation utilities
 */

/**
 * Translate path parameters of a URI to a generic version thanks to regex
 */
export function uriToRegex(value: string): string {
  return String(value).replace(/{[^}]+}/g, "[^/]+") + "$";
}
