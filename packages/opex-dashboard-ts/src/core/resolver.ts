import SwaggerParser from "@apidevtools/swagger-parser";

import { OpenAPISpec } from "../utils/openapi.js";

export class OA3Resolver {
  async resolve(specPath: string): Promise<OpenAPISpec> {
    try {
      const spec = await SwaggerParser.parse(specPath);
      return spec as OpenAPISpec;
    } catch (error: unknown) {
      throw (
        new Error(`OA3 parsing error: ${String(error)}`),
        { cause: error }
      );
    }
  }
}
