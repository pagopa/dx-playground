# Build, Test, and Lint Commands

Reference for running builds, tests, linting, and code generation in this monorepo.

## Task Orchestration: Turborepo

**Turborepo** is the monorepo task manager. It orchestrates tasks, manages dependencies between them, and provides caching. Most commands run through Turborepo to leverage these capabilities.

**Package manager**: **pnpm** (Corepack enabled) handles dependency installation.

## Root Monorepo Commands (via Turborepo)

- **Install deps**: `pnpm install` (run once; pnpm manages this)
- **Full code review** (typecheck + lint check + test): `pnpm code-review` *(run before opening a PR)* (Turborepo orchestrates all 3)
- **Build everything**: `pnpm build` (Turborepo respects task dependencies and caching)
- **Typecheck all workspaces**: `pnpm typecheck`
- **Lint & fix all workspaces**: `pnpm lint`
- **Run all tests**: `pnpm test`
- **Test with coverage**: `pnpm test:coverage`

## Workspace / Package-Scoped Commands

Run from a package directory:

```bash
cd apps/to-do-api && pnpm typecheck
cd apps/to-do-api && pnpm lint:check
cd apps/to-do-api && pnpm test
```

Or use `pnpm --filter` from repo root:

```bash
pnpm --filter to-do-api test
pnpm --filter to-do-api typecheck
```

## Running a Single Test

### By test name (pattern):

```bash
# From repo root
pnpm test -- -t "pattern"

# From workspace directory
cd apps/to-do-api && pnpm test -- -t "should do X"
```

### By file path:

```bash
pnpm test -- path/to/file.test.ts
pnpm --filter to-do-api test -- path/to/file.test.ts
```

### Watch a single test file:

```bash
pnpm test -- --watch path/to/file.test.ts
```

## Code Generation and Infrastructure

### OpenAPI and CDKTF code generation

Run before building if the package uses code generation:

```bash
cd apps/to-do-api && pnpm run generate
```

### Infrastructure generator (root):

```bash
pnpm infra:generate
```

## Tooling Overview

- **Test Framework**: Vitest (workspace config in `vitest.workspace.ts`)
- **Linting**: ESLint with `@pagopa/eslint-config`. Use `lint:check` in CI.
- **Formatting**: Prettier + EditorConfig (2-space indent, LF, max line length 80)
- **TypeScript**: ESM (`type: module`) and strict mode enabled across workspaces
