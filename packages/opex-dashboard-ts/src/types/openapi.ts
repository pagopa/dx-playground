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
