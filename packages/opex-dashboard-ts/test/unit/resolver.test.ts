import { OpenAPISpecResolverAdapter, ParseError } from "../../src/infrastructure/openapi/openapi-spec-resolver-adapter.js";
import { describe, it, expect, beforeEach } from "vitest";

describe("OA3Resolver", () => {
  let resolver: OpenAPISpecResolverAdapter;

  beforeEach(() => {
    resolver = new OpenAPISpecResolverAdapter();
  });

  describe("ParseError", () => {
    it("should be a custom error class", () => {
      const error = new ParseError("Test error");
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe("ParseError");
      expect(error.message).toBe("Test error");
    });

    it("should have proper inheritance", () => {
      const error = new ParseError("Test error");
      expect(error instanceof Error).toBe(true);
      expect(error instanceof ParseError).toBe(true);
    });
  });

  describe("OA3Resolver class", () => {
    it("should be instantiable", () => {
      expect(resolver).toBeInstanceOf(OpenAPISpecResolverAdapter);
    });

    it("should have a resolve method", () => {
      expect(typeof resolver.resolve).toBe("function");
    });

    it("should have resolve method that returns a Promise", () => {
      const result = resolver.resolve("./test_openapi.yaml");
      expect(result).toBeInstanceOf(Promise);
    });
  });
});
