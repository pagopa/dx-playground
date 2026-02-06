# Agent Guidelines

Concise operating instructions for automated agents and coding assistants working in this repository.

**Monorepo Overview**: TypeScript monorepo using **pnpm** (Corepack) and **Turborepo**. See `.github/copilot-instructions.md` for project architecture, tech stack, and structure.

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

- **[TypeScript, Types, and Error Handling](./docs/agents/typescript.md)**: Type safety, fp-ts patterns, error handling, imports, naming conventions
- **[Testing Patterns](./docs/agents/testing.md)**: Vitest setup, test organization, mocking, fixture patterns
- **[Code Formatting and Linting](./docs/agents/formatting.md)**: EditorConfig, Prettier, ESLint, line length standards
- **[Git Workflow and PR Requirements](./docs/agents/git-workflow.md)**: PR checklist, changesets, Definition of Done
- **[Practical Tips](./docs/agents/practical-tips.md)**: Workflow optimization, dependency patterns, finding conventions

## Authority and Compliance

This document provides quick reference and links to focused guidance. For the authoritative project overview, see `.github/copilot-instructions.md`.

**All agents MUST comply with**:
1. The requirements above (code review, English-only)
2. The focused guidance in linked docs
3. The conventions in `.github/copilot-instructions.md`

Last updated: 2026-02-06
