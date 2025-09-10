import { OpenAPIV2, OpenAPIV3 } from "openapi-types";

export type OpenAPISpec = OpenAPIV2.Document | OpenAPIV3.Document;

// Type guards to check OpenAPI version
export function isOpenAPIV2(spec: OpenAPISpec): spec is OpenAPIV2.Document {
  return "swagger" in spec;
}

export function isOpenAPIV3(spec: OpenAPISpec): spec is OpenAPIV3.Document {
  return "openapi" in spec;
}
