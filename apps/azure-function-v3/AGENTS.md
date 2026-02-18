# Azure Function Workspace

Azure Function app exposing REST APIs. Related: Azure-specific adapters package.

## Workspace-Specific Commands

| Command               | Purpose                               |
| --------------------- | ------------------------------------- |
| `pnpm start`          | Run function runtime locally          |
| `pnpm start:artifact` | Test bundled production artifact      |
| `pnpm build:artifact` | Bundle for Azure deployment (ESBuild) |

## Workspace-Specific Structure

```
src/
├── handlers.ts        # Request handler implementations
├── validation.ts      # Input validation (io-ts)
└── __tests__/data.ts  # Test fixtures

docs/openapi.yaml      # API specification (source of truth)
host.json              # Azure Functions v4 config
```

## Workspace-Specific Guidelines

**OpenAPI-First Development**

- OpenAPI spec in `docs/openapi.yaml` (source of truth)
- Code generation runs automatically via Turborepo
- Generated types appear in compiled output; don't edit

**Handler Implementation**

- Use `@pagopa/handler-kit` for handler patterns
- Use `io-ts` for input validation
- Use `Either/TaskEither` for error handling

**Configuration**

- `host.json`: Azure Functions v4 settings
- `local.settings.json`: Local dev only (not committed)
- Use `.env.local` for environment variables

**Testing**

- Mock Azure services using `vitest-mock-extended`
- See [Testing Patterns](../../docs/agents/testing.md)

## Additional Resources

- [Build, Test, and Lint Commands](../../docs/agents/commands.md)
- [Azure Functions Guide](../../docs/agents/azure-functions.md)
- [TypeScript Guide](../../docs/agents/typescript.md)
- [Root AGENTS.md](../../AGENTS.md) – Essential requirements and detailed guidance index
