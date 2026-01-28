AGENTS GUIDELINES FOR AUTOMATED AGENTS

This document gives operating instructions for agentic coding assistants working in this repository.
Place: repository root. Keep concise; follow existing conventions in `.github/copilot-instructions.md`.

Build / Lint / Test (commands)
- Root monorepo (uses pnpm + Turborepo)
  - Install deps: `pnpm install` (Corepack enabled)
  - Full code review (typecheck + lint check + test): `pnpm code-review`
  - Build everything: `pnpm build`
  - Typecheck all workspaces: `pnpm typecheck`
  - Lint & fix all workspaces: `pnpm lint`
  - Run all tests: `pnpm test`
  - Test with coverage: `pnpm test:coverage`

- Workspace / package scoped
  - Run package scripts from package dir, e.g.:
    - `cd apps/to-do-api && pnpm typecheck`
    - `cd apps/to-do-api && pnpm lint:check`
    - `cd apps/to-do-api && pnpm test`
  - Use pnpm filter when remote execution is desired:
    - `pnpm --filter to-do-api test`

- Running a single test (recommended patterns)
  - By test name (pattern):
    - From repo root: `pnpm test -- -t "pattern"`
    - From workspace: `cd apps/to-do-api && pnpm test -- -t "should do X"`
  - By file path:
    - `pnpm test -- path/to/file.test.ts`
    - `pnpm --filter to-do-api test -- path/to/file.test.ts`
  - Watch a single test file:
    - `pnpm test -- --watch path/to/file.test.ts`

Code generation / infra
- Run generators before build if the package needs it (OpenAPI / CDKTF):
  - Example: `cd apps/to-do-api && pnpm run generate`
- Infra generator job (root): `pnpm infra:generate`

Repository tooling notes
- Tests: Vitest (workspace config in `vitest.workspace.ts`)
- Linting: ESLint with `@pagopa/eslint-config`. Use `lint:check` in CI.
- Formatting: Prettier + EditorConfig (2-space indent, LF, max_line_length=80).
- TypeScript: ESM (`type: module`) and strict mode enabled across workspaces.

Code Style Guidelines (apply consistently)

Language + Types
- Use TypeScript with strict checking. Run `pnpm typecheck` frequently.
- Prefer explicit types for public APIs; internal helpers may use inference when unambiguous.
- Avoid `any`. If you must use it, add a TODO and justify in code review.
- Never use `@ts-ignore` to silence real errors. Fix root cause or use `unknown` + runtime validation.
- For external/untrusted inputs use `io-ts` (or io-ts codecs) to validate and decode into typed values.
- Prefer `readonly` and immutable structures where possible.

Functional patterns & error handling
- Follow fp-ts patterns for domain logic when already used in the package (Either, Option, TaskEither).
- Do not throw raw errors across async boundaries; use domain-wrapping (Either/TaskEither) or well-typed Error classes.
- Always add contextual information when mapping or converting errors. Keep messages in English.
- Do not swallow errors. Log then rethrow or return an explicit error value.

Imports & module layout
- Use ESM-style imports (no require). Prefer named imports.
- Ordering preference:
  1. Node built-ins
  2. External packages (alphabetical)
  3. Workspace packages (use `workspace:`/package name like `@to-do/domain`)
  4. Internal modules (absolute-ish paths inside package)
  5. Relative imports (`./`, `../`)
- Separate groups with a single blank line.
- Keep imports extensionless (no `.js`/`.ts`), except where tooling requires.

Formatting & lint
- Follow EditorConfig: 2-space indent, LF line endings, final newline, max 80 columns.
- Use Prettier for formatting. If commit hooks are present, they will run as configured.
- Fix lint errors with `pnpm lint` or `pnpm --filter <pkg> lint` before pushing.
- ESLint configuration is provided by `@pagopa/eslint-config`; prefer its rules unless a package explicitly pins a different config.

Naming & API design
- Variables & functions: camelCase and descriptive (e.g. `fetchUserById`).
- Types, interfaces, classes: PascalCase (e.g. `UserDto`, `TaskService`). Do not prefix with `I`.
- Constants that are truly global/static: UPPER_SNAKE_CASE.
- Keep functions small and focused; prefer pure functions in domain logic.

Testing
- Use Vitest; tests should live next to source or under `__tests__` with `.test.ts` suffix.
- Write tests for both success and failure cases; unit tests for logic, integration tests for interactions.
- Mock external services (Azure, HTTP) with `vitest-mock-extended` or equivalent.
- Test data: put fixtures under `__tests__/data.ts` or `tests/fixtures` and reuse across tests.
- Ensure deterministic tests (avoid real network/cosmos calls unless explicitly marked as integration and gated).

Git / PR / release workflow for agents
- Always run `pnpm code-review` before creating PRs.
- Add a changeset for any package version bump: `pnpm changeset`.
- Follow the Definition of Done from `.github/copilot-instructions.md`:
  - Typecheck passes, lint passes, tests pass, new functionality has tests, code-review passes.

Copilot / AI assistant rules
- This repo includes guidance in `.github/copilot-instructions.md` — agents MUST follow it.
  - English-only code & messages
  - Run `pnpm code-review` after changes
  - Do not commit code that fails typecheck, lint, or tests
  - Use io-ts/fp-ts patterns where applicable
  - See the full file at `.github/copilot-instructions.md` for the authoritative list

Cursor rules
- No Cursor rules were found in `.cursor/rules/` or `.cursorrules` at the time this file was created. If such rules are added, update this file and follow their constraints.

Practical tips for agents
- When making changes: 1) run `pnpm generate` if package uses codegen, 2) run `pnpm typecheck` and `pnpm lint`, 3) run package tests (`pnpm test -- <path or -t pattern>`), 4) run `pnpm code-review`.
- For workspace-specific work prefer `pnpm --filter <package>` to avoid running the entire monorepo when not needed.
- When adding dependencies, prefer using `catalog:` versions defined in `pnpm-workspace.yaml` or `workspace:^` for internal packages.

Where to look for conventions
- ESLint configs: package-level `eslint.config.js` or root config; prefer `@pagopa/eslint-config`.
- TypeScript configs: `tsconfig.json` in each workspace and shared `@pagopa/typescript-config-node` / `typescript-config-react` packages.
- CI scripts & pipelines: `.github/workflows/*` for how CI runs checks.

If uncertain
- Make a best-effort change following the above, run the checks, and if anything is ambiguous open a small PR with the change and ask for human review.

Last updated: 2026-01-28
