# Testing Patterns and Practices

Guidelines for writing effective, deterministic tests using Vitest.

## Test Setup and Organization

- Use **Vitest** as the test framework.
- Tests should live **next to source code** with `.test.ts` suffix, or under `__tests__/` directories.
- **Test data and fixtures** go in `__tests__/data.ts` or `tests/fixtures/`. Reuse fixtures across tests.

## What to Test

- Write tests for **both success and failure cases**.
- **Unit tests** for logic; **integration tests** for interactions.
- **Mock external services** (Azure, HTTP calls) using `vitest-mock-extended` or equivalent.
- Ensure **deterministic tests**: avoid real network/Cosmos DB calls unless explicitly marked as integration tests and gated.

## Test Fixtures and Mocking

Example fixture organization:

```typescript
// __tests__/data.ts
export const mockUser = { id: "1", name: "Alice" };
export const mockError = new Error("Service unavailable");
```

Reuse in multiple test files:

```typescript
import { mockUser } from "./__tests__/data.ts";
```

For Azure services and HTTP calls, mock with:

```typescript
import { mock, spyOn } from "vitest";
import { mockDeep } from "vitest-mock-extended";

const mockCosmosClient = mockDeep<CosmosClient>();
```

## Determinism

- **Avoid real I/O**: no actual Azure calls, HTTP requests, or database queries in unit tests.
- Tests must pass reliably on any machine without external dependencies.
- Mark integration tests separately if they require external services.

## Test Execution

See [Build, Test, and Lint Commands](./commands.md) for running tests by pattern, file, or with watch mode.

## Test Data Organization

Tests should place data and fixtures in `__tests__/data.ts`:

```typescript
// src/__tests__/data.ts
export const mockTodo = {
  id: "1",
  title: "Buy groceries",
  completed: false,
};

export const mockError = new Error("Service unavailable");

export const mockList = [mockTodo];
```

Reuse across test files:

```typescript
import { mockTodo, mockError } from "./__tests__/data.ts";

it("handles errors", async () => {
  // use mockError
});
```

## Related Guidance

For io-ts validation patterns in tests, see [TypeScript, Types, and Error Handling](./typescript.md).

For project organization, see [Project Organization](./project-organization.md).
