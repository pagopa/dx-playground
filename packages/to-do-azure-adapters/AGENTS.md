# Azure Adapters Package: `to-do-azure-adapters`

Azure-specific adapters for Cosmos DB, Blob Storage, identity, and other Azure services. Bridges domain logic with Azure SDKs. Used by Azure Function apps.

## Workspace-Specific Commands

| Command      | Purpose                          |
| ------------ | -------------------------------- |
| `pnpm build` | Compile TypeScript to JavaScript |

## Workspace-Specific Structure

```
src/
├── cosmos/
│   ├── todoRepository.ts  # Cosmos DB adapter
│   └── __tests__/data.ts  # Mocked fixtures
├── identity/
│   ├── authentication.ts  # Azure Identity adapter
│   └── __tests__/...
├── types.ts               # Shared types
└── index.ts               # Public exports

dist/                      # Build output
```

## Workspace-Specific Guidelines

**Adapter Pattern**

- Separate domain logic from Azure SDK implementation
- Accept Azure clients as constructor/function parameters (dependency injection)
- Return `TaskEither<Error, T>` for async operations
- Return `Either<Error, T>` for sync operations
- Never throw exceptions; return error values

**Example: Cosmos DB Adapter**

```typescript
import { CosmosClient } from "@azure/cosmos";
import * as TE from "fp-ts/TaskEither";

export const createTodoRepository = (cosmosClient: CosmosClient) => ({
  save: (todo: Todo): TE.TaskEither<Error, Todo> =>
    TE.tryCatch(
      () => client.database("todos").container("items").items.upsert(todo),
      (error) => new Error(`Failed to save: ${error}`),
    ),
});
```

**Error Handling with Either/TaskEither**

- Use `Either<Error, T>` for synchronous operations
- Use `TaskEither<Error, T>` for async operations
- Add contextual information to error messages
- See [TypeScript Guide](../../docs/agents/typescript.md) for fp-ts patterns

**Mocking Azure Services in Tests**

- Use `vitest-mock-extended` to mock Azure clients
- **Never call real Azure services in unit tests**
- Mock at the Azure SDK level, not domain layer

```typescript
import { mockDeep } from "vitest-mock-extended";

const mockClient = mockDeep<CosmosClient>();
mockClient
  .database()
  .container()
  .items.upsert.mockResolvedValue({
    resource: { id: "1", title: "Test" },
  });
```

**Testing Strategy**

- Test each adapter in isolation
- Test error cases (network failures, 404s, timeouts)
- Use test fixtures in `src/__tests__/data.ts`
- Test mocking, not Azure calls
- See [Testing Guide](../../docs/agents/testing.md) for patterns

**Dependencies**

- Azure SDKs: `@azure/cosmos`, `@azure/identity`, etc.
- Functional libs: `fp-ts`, `io-ts`
- Domain package: `@to-do/domain` (workspace:^)
- **Keep Azure SDK versions consistent** across all workspaces
- See [Root AGENTS.md](../../AGENTS.md) for dependency patterns

**Type Safety**

- Type domain inputs/outputs strictly
- Use discriminated unions for Azure responses
- Avoid `any` types (use `unknown` with validation)

**Dependency Injection Benefits**

- Makes testing easier (inject mock Azure clients)
- Makes code portable (swap implementations)
- Enables test isolation (no Azure dependencies)

## Additional Resources

- [Build, Test, and Lint Commands](../../docs/agents/commands.md)
- [TypeScript Guide](../../docs/agents/typescript.md) – fp-ts, Either, TaskEither
- [Testing Guide](../../docs/agents/testing.md) – Mocking, test setup
- [Project Organization](../../docs/agents/project-organization.md)
- [Root AGENTS.md](../../AGENTS.md) – Essential requirements and detailed guidance index
