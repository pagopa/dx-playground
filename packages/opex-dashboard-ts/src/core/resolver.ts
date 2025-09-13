import SwaggerParser from "@apidevtools/swagger-parser";

import { OpenAPISpec } from "../shared/openapi.js";

export class OA3Resolver {
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
}

export class ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ParseError";
  }
}
