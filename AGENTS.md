# Agent Guidelines

Concise operating instructions for automated agents and coding assistants working in this repository.

**Monorepo Overview**: TypeScript monorepo using **pnpm** (Corepack) and **Turborepo**. See [Project Structure](./docs/agents/project-structure.md) and [Tech Stack](./docs/agents/tech-stack.md) for details.

## Essential Requirements

### Code Review Before PR

**Always run `pnpm code-review` before creating or updating a pull request.** This validates:

- Typecheck (`pnpm typecheck`)
- Linting (`pnpm lint:check`)
- Tests (`pnpm test`)

If code-review fails, fix issues before pushing.

### English-Only Rule

All code, comments, documentation, variable names, function names, type definitions, error messages, and commit messages **MUST be in English**.

## Quick Start Commands

See [Build, Test, and Lint Commands](./docs/agents/commands.md) for:

- Root monorepo commands (`pnpm build`, `pnpm test`, etc.)
- Workspace-scoped commands
- Running single tests by pattern or file
- Code generation commands

## Detailed Guidance by Topic

**Core Agent Guidance:**

- **[Build, Test, and Lint Commands](./docs/agents/commands.md)**: Build system, Turborepo, test execution, code generation
- **[TypeScript, Types, and Error Handling](./docs/agents/typescript.md)**: Type safety, fp-ts patterns, error handling, imports, naming conventions
- **[Testing Patterns](./docs/agents/testing.md)**: Vitest setup, test organization, mocking, fixture patterns
- **[Code Formatting and Linting](./docs/agents/formatting.md)**: EditorConfig, Prettier, ESLint, line length standards
- **[Git Workflow and PR Requirements](./docs/agents/git-workflow.md)**: PR checklist, changesets, Definition of Done
- **[Practical Tips](./docs/agents/practical-tips.md)**: Workflow optimization, dependency patterns, finding conventions

**Project Context:**

- **[Project Structure](./docs/agents/project-structure.md)**: Monorepo layout (`/apps`, `/packages`, `/infra`, `/apimartifacts`)
- **[Project Organization](./docs/agents/project-organization.md)**: Where to place code (domain logic, adapters, functions, apps)
- **[Tech Stack](./docs/agents/tech-stack.md)**: Languages, frameworks, libraries, tools

**Framework-Specific Patterns:**

- **[Azure Functions](./docs/agents/azure-functions.md)**: Handler patterns, OpenAPI-first development, validation, configuration
- **[Next.js Applications](./docs/agents/nextjs-apps.md)**: Server Components, API clients, styling, error handling
- **[Infrastructure](./docs/agents/infrastructure.md)**: Terraform modules, CDKTF, environment configuration

## Authority and Compliance

**All agents MUST comply with**:

1. The requirements above (code review, English-only)
2. The focused guidance in linked docs

Last updated: 2026-02-06
