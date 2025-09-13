import SwaggerParser from "@apidevtools/swagger-parser";

import { IOpenAPISpecResolver, OpenAPISpec } from "../../domain/index.js";
import { isOpenAPIV2, isOpenAPIV3 } from "../../shared/openapi.js";

export class OpenAPISpecResolverAdapter implements IOpenAPISpecResolver {
  async resolve(specPath: string): Promise<OpenAPISpec> {
    try {
      const spec = await SwaggerParser.parse(specPath);
      return spec as OpenAPISpec;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new ParseError(`OA3 parsing error: ${error.message}`);
      }
      throw new ParseError(`OA3 parsing error: ${String(error)}`);
    }
  }

  async resolveWithHosts(
    specPath: string,
  ): Promise<{ hosts: string[]; spec: OpenAPISpec }> {
    const spec = await this.resolve(specPath);
    const hosts = this.extractHostsFromSpec(spec);
    return { hosts, spec };
  }

  private extractHostsFromSpec(spec: OpenAPISpec): string[] {
    if (isOpenAPIV3(spec)) {
      // OpenAPI 3.x uses servers array
      if (spec.servers && spec.servers.length > 0) {
        return spec.servers.map((server) => {
          try {
            const url = new URL(server.url);
            return url.hostname;
          } catch {
            return server.url.replace(/^https?:\/\//, "").split("/")[0];
          }
        });
      }
    } else if (isOpenAPIV2(spec)) {
      // OpenAPI 2.x uses host field
      if (spec.host) {
        return [spec.host];
      }
    }
    return [];
  }
}

export class ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ParseError";
  }
}
