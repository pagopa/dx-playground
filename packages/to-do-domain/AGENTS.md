# Domain Package Workspace: `to-do-domain`

Pure domain logic (business rules, entities, use cases). No Azure or framework dependencies. Used by apps and adapters.

## Workspace-Specific Commands

| Command      | Purpose                          |
| ------------ | -------------------------------- |
| `pnpm build` | Compile TypeScript to JavaScript |

## Workspace-Specific Structure

```
src/
├── todo.ts           # Domain logic (pure functions)
├── types.ts          # Type definitions
├── index.ts          # Public exports
└── __tests__/data.ts # Test fixtures

dist/                 # Build output
```

## Workspace-Specific Guidelines

**Pure Functions & Immutability**

- No side effects; functions must be deterministic
- Return new objects instead of mutating arguments
- Use functional patterns (`fp-ts`, `Either`, `Option`)
- See [TypeScript Guide](../../docs/agents/typescript.md) for fp-ts patterns

**Code Organization**

- Separate types from implementation
- Keep one concern per file
- Avoid importing from consuming packages (prevents circular dependencies)
- Export all public types and functions from `src/index.ts` (named exports only)

**Example: Pure Domain Logic**

```typescript
import * as E from "fp-ts/Either";

export const validateTitle = (title: string): E.Either<string, string> =>
  title.trim().length > 0
    ? E.right(title.trim())
    : E.left("Title cannot be empty");

export const createTodo = (title: string): E.Either<string, Todo> =>
  E.chain((t) => E.right({ id: generateId(), title: t, completed: false }))(
    validateTitle(title),
  );
```

**Testing Strategy**

- Write unit tests for all exported functions
- Test both success and error cases
- Use test fixtures in `src/__tests__/data.ts`
- Aim for meaningful coverage
- See [Testing Guide](../../docs/agents/testing.md) for patterns

**Type Safety**

- Avoid `any` types (use `unknown` with validation)
- Use discriminated unions for domain entities
- Use type guards for validation
- See [TypeScript Guide](../../docs/agents/typescript.md) for strict typing

**Dependency Strategy**

- **Minimize external dependencies** – this is pure logic
- Use only: `fp-ts`, `io-ts`, `utility-types`
- **Never use**: React, Next.js, Azure SDKs, framework-specific libs
- See [Root AGENTS.md](../../AGENTS.md) for dependency patterns

**Publishing**

- Private package (internal use only)
- Consumed by: `apps/to-do-api`, `apps/to-do-webapp`, `@to-do/azure-adapters`

## Additional Resources

- [Build, Test, and Lint Commands](../../docs/agents/commands.md)
- [TypeScript Guide](../../docs/agents/typescript.md) – fp-ts patterns, error handling
- [Testing Guide](../../docs/agents/testing.md) – Unit test setup
- [Project Organization](../../docs/agents/project-organization.md)
- [Root AGENTS.md](../../AGENTS.md) – Essential requirements and detailed guidance index
