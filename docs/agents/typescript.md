# TypeScript, Types, and Error Handling

Guidelines for writing type-safe, maintainable TypeScript code in this monorepo.

## Language and Types

- Use TypeScript with **strict mode** enabled. Run `pnpm typecheck` frequently.
- Prefer **explicit types** for public APIs; internal helpers may use inference when unambiguous.
- **Avoid `any`**. If you must use it, add a TODO and justify in code review.
- **Never use `@ts-ignore`** to silence real errors. Fix the root cause instead, or use `unknown` + runtime validation.
- For external/untrusted inputs, use `io-ts` (or io-ts codecs) to validate and decode into typed values.
- Prefer `readonly` and **immutable structures** where possible.

## Functional Patterns and Error Handling

### Functional Programming

- Follow **fp-ts patterns** for domain logic when already used in the package (Either, Option, TaskEither).
- Use domain-wrapping patterns instead of throwing raw errors across async boundaries; prefer Either/TaskEither or well-typed Error classes.

### Error Handling Best Practices

- **Always add contextual information** when mapping or converting errors. Keep error messages in **English**.
- **Do not swallow errors**. Log then rethrow, or return an explicit error value.
- Avoid throwing exceptions in async contexts; use typed error values instead.

## Imports and Module Layout

- Use **ESM-style imports** (no `require`). Prefer named imports.
- **Import ordering** (separate groups with a blank line):
  1. Node built-ins (`fs`, `path`, etc.)
  2. External packages (alphabetical)
  3. Workspace packages (use `workspace:` protocol or package name like `@to-do/domain`)
  4. Internal modules (absolute-ish paths inside package)
  5. Relative imports (`./`, `../`)
- **Keep imports extensionless** (no `.js` or `.ts`), except where tooling requires.

## Naming Conventions

- **Variables & functions**: `camelCase` and descriptive (e.g., `fetchUserById`)
- **Types, interfaces, classes**: `PascalCase` (e.g., `UserDto`, `TaskService`). Do NOT prefix with `I`
- **Constants** (truly global/static): `UPPER_SNAKE_CASE`
- **Keep functions small and focused**; prefer pure functions in domain logic

## Related Guidance

For formatting rules (2-space indent, line length, etc.), see [Formatting and Linting](./formatting.md).

For testing patterns with io-ts and fp-ts, see [Testing](./testing.md).
