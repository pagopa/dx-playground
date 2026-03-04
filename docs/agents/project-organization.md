# Project Organization

Guidelines for where to place code and how to organize modules in this monorepo.

## Where to Put Code

### Domain Logic

Keep business logic and domain rules in `/packages/to-do-domain/`:
- Domain models and entities
- Business rules and validations
- Use cases and workflows
- Pure functions with no Azure dependencies

### Infrastructure Adapters

Keep Azure-specific logic in `/packages/to-do-azure-adapters/`:
- Azure Cosmos DB access
- Azure Function handlers
- Integration with Azure SDKs
- Dependency injection configuration

### Shared Configuration

Shared TypeScript configurations live in `/packages/`:
- **typescript-config-node/** – Config for Node.js projects (APIs, infrastructure)
- **typescript-config-react/** – Config for React projects (web apps)

Reference these in `tsconfig.json`:
```json
{
  "extends": "@pagopa/typescript-config-node/tsconfig.json"
}
```

### Azure Functions

Structure Azure Function apps in `/apps/`:
```
apps/to-do-api/
├── src/
│   └── handlers.ts        # Request handlers
├── docs/
│   └── openapi.yaml       # OpenAPI specification
├── host.json              # Function runtime config
└── local.settings.json    # Local development settings
```

**Guidelines**:
- Use `@pagopa/handler-kit` for consistent handler patterns
- Define OpenAPI specs before implementation
- Use `@pagopa/openapi-codegen-ts` for code generation from specs
- Configure `host.json` for Azure Functions v4
- Use ESBuild for production artifact bundling

### Next.js Applications

Structure Next.js apps in `/apps/` following App Router conventions:
```
apps/to-do-webapp/
├── src/
│   ├── app/               # App Router pages/layouts
│   ├── lib/
│   │   └── client/        # API client code (generated from OpenAPI)
│   └── components/        # React components
├── public/                # Static assets
└── next.config.js         # Next.js config
```

**Guidelines**:
- Use Server Components by default
- Place API client code in `src/lib/client/` (generated from OpenAPI)
- Use Material-UI for consistent styling
- Implement proper error boundaries
- Keep styling with Emotion (@emotion/react, @emotion/styled)

## Infrastructure Organization

### Terraform Modules

Define Terraform modules in `/infra/resources/_modules/`:
- One module per concern (e.g., `monitoring`, `networking`, `storage`)
- Include `README.md` documenting the module
- Use variables for configuration; avoid hardcoding

### Environment-Specific Configs

Keep environment configs in subdirectories:
```
infra/resources/
├── _modules/              # Reusable modules
├── dev/                   # Development environment
├── staging/               # Staging environment
└── prod/                  # Production environment
```

### CDKTF Infrastructure

Use CDKTF (`@cdktf/provider-azurerm`) for complex infrastructure patterns:
- Define infrastructure in `packages/cdktf-monitoring-stack/`
- Prefer CDKTF for dynamic, parameterized infrastructure
- Use plain Terraform modules for simpler, static patterns

## Testing Organization

### Test Location

Tests belong next to source code:
```
src/
├── handlers.ts
├── handlers.test.ts       # Unit tests
└── __tests__/
    └── data.ts            # Shared test fixtures
```

Or in a dedicated `__tests__/` directory:
```
__tests__/
├── unit/
│   ├── handlers.test.ts
│   └── validation.test.ts
├── integration/
│   └── azure-cosmos.test.ts
└── data.ts                # Shared fixtures
```

### Test Data

Place test data and fixtures in `__tests__/data.ts`:
```typescript
export const mockTodo = { id: "1", title: "Test", completed: false };
export const mockError = new Error("Service unavailable");
```

Reuse across test files.

## Related Guidance

For code style and conventions, see [TypeScript, Types, and Error Handling](./typescript.md).

For testing patterns, see [Testing Patterns](./testing.md).

For Azure Function patterns, see [Azure Functions](./azure-functions.md).

For Next.js patterns, see [Next.js Applications](./nextjs-apps.md).

For infrastructure patterns, see [Infrastructure](./infrastructure.md).
