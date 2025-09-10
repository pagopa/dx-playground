import SwaggerParser from "@apidevtools/swagger-parser";
import { OpenAPISpec } from "../utils/openapi";

export class ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ParseError";
  }
}

export class OA3Resolver {
  async resolve(specPath: string): Promise<OpenAPISpec> {
    try {
      const spec = await SwaggerParser.parse(specPath);
      return spec as OpenAPISpec;
    } catch (error: any) {
      throw new ParseError(`OA3 parsing error: ${error.message}`);
    }
  }
}
