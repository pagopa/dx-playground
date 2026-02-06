# Azure Functions

Guidelines and patterns for Azure Function applications in this monorepo.

## Azure Functions Stack

- **Runtime**: Azure Functions v4 (@azure/functions)
- **Language**: TypeScript (compiled to JavaScript)
- **Handler Kit**: @pagopa/handler-kit and @pagopa/handler-kit-azure-func

## Structuring Azure Function Apps

Place Azure Function apps in `/apps/`:

```
apps/to-do-api/
├── src/
│   ├── handlers.ts              # Handler implementations
│   ├── validation.ts            # Input validation (io-ts)
│   └── __tests__/
│       ├── handlers.test.ts
│       └── data.ts
├── docs/
│   └── openapi.yaml             # OpenAPI specification
├── host.json                    # Function runtime config
├── local.settings.json          # Local development settings
├── function.json                # Function binding definitions
├── package.json
└── tsconfig.json
```

## OpenAPI-First Development

1. **Define the spec first**: Write OpenAPI specification in `docs/openapi.yaml`
2. **Generate code**: Use @pagopa/openapi-codegen-ts to generate request/response types
3. **Implement handlers**: Use generated types for type safety

Benefits:
- Contract-driven development (spec before implementation)
- Automatic type generation
- Documentation is always current

## Handler Patterns

Use `@pagopa/handler-kit` for consistent, type-safe handler patterns:

```typescript
import { Handler } from "@pagopa/handler-kit";
import * as E from "fp-ts/Either";

const handler: Handler<InputType, OutputType> = async (request) => {
  return E.right({
    statusCode: 200,
    body: { message: "success" },
  });
};

export default handler;
```

**Benefits**:
- Consistent error handling (Either/TaskEither)
- Automatic request/response parsing
- Logging and tracing integration
- Type safety end-to-end

## Input Validation

Use `io-ts` for runtime validation of Azure Function inputs:

```typescript
import * as t from "io-ts";
import { PathReporter } from "io-ts/lib/PathReporter";

const TodoRequest = t.type({
  id: t.string,
  title: t.string,
  completed: t.boolean,
});

const validated = TodoRequest.decode(input);
if (E.isLeft(validated)) {
  return E.left({
    statusCode: 400,
    body: PathReporter.report(validated),
  });
}
```

## Configuration

### host.json

Configure runtime settings for Azure Functions v4:

```json
{
  "version": "2.0",
  "logging": {
    "applicationInsights": {
      "samplingSettings": {
        "isEnabled": true
      }
    }
  },
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle",
    "version": "[4.*, 5.0.0)"
  }
}
```

### local.settings.json

Local development settings (not committed):

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "FUNCTIONS_EXTENSION_VERSION": "~4"
  }
}
```

## Building for Production

Use ESBuild for efficient production bundling:

```javascript
// esbuild.config.js
import esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/handlers.ts"],
  bundle: true,
  outfile: "dist/handlers.js",
  external: ["@azure/functions"],
  platform: "node",
});
```

## Best Practices

1. **Use OpenAPI specs** as the source of truth
2. **Use @pagopa/handler-kit** for consistent patterns
3. **Validate inputs with io-ts** (never trust external input)
4. **Use Either/TaskEither** for error handling (no exceptions)
5. **Keep host.json v4 compatible** when upgrading
6. **Test handlers in isolation** (mock Azure dependencies)
7. **Log contextually** using @pagopa/azure-tracing
8. **Use environment variables** for configuration
9. **Document API contracts** in OpenAPI specs
10. **Bundle for production** with ESBuild or similar

## Common Tasks

### Create a new handler

1. Add endpoint to `docs/openapi.yaml`
2. Run code generation: `pnpm run generate`
3. Implement handler in `src/handlers.ts` using generated types
4. Write tests in `src/__tests__/handlers.test.ts`
5. Test locally: `func start`

### Add dependencies

Use catalog versions when available:

```json
{
  "@azure/functions": "catalog:",
  "io-ts": "catalog:"
}
```

### Test handlers

Mock Azure dependencies using `vitest-mock-extended`:

```typescript
import { mockDeep } from "vitest-mock-extended";

const mockCosmosClient = mockDeep<CosmosClient>();
mockCosmosClient.database("todos").container("items").items.upsert.mockResolvedValue({
  resource: { id: "1" },
});
```

## Related Guidance

For testing patterns, see [Testing Patterns](./testing.md).

For TypeScript patterns, see [TypeScript, Types, and Error Handling](./typescript.md).

For project organization, see [Project Organization](./project-organization.md).
