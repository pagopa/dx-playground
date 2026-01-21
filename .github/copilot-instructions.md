# GitHub Copilot Instructions for DX Playground

## Project Overview

This is a **monorepo** project managed with **pnpm workspaces** and **Turborepo** for build orchestration. The project follows a modular architecture with applications, shared packages, and infrastructure-as-code.

## Project Structure

### `/apps`

Contains deployable applications. Each application is a separate workspace that produces a deployable artifact.

**Applications:**

- `azure-function-v3/` - Azure Function application (v3)
- `test-durable-function/` - Azure Durable Functions implementation
- `to-do-api/` - Azure Function REST API for To Do List (main API service)
- `to-do-webapp/` - Next.js web application for To Do List UI
- `new-webapp/` - Next.js web application
- `test-opex-api/` - Test API for operational excellence

### `/packages`

Contains shared, reusable TypeScript modules consumed by apps. Packages with `private: true` are for internal sharing; others are publishable to public registries.

**Packages:**

- `to-do-domain/` - Domain logic and business rules for To Do application
- `to-do-azure-adapters/` - Azure-specific adapters for To Do application
- `cdktf-monitoring-stack/` - CDKTF constructs for monitoring infrastructure
- `opex-common/` - Common utilities for operational excellence
- `typescript-config-node/` - Shared TypeScript configuration for Node.js projects
- `typescript-config-react/` - Shared TypeScript configuration for React projects

### `/infra`

Infrastructure-as-code using Terraform/CDKTF for Azure resources and deployment environments.

**Structure:**

- `bootstrapper/` - Bootstrap scripts for environment setup
- `repository/` - Repository-level infrastructure configuration
- `resources/` - Main infrastructure resources (Terraform modules, environments)

### `/apimartifacts`

Azure API Management configurations including APIs, backends, policies, diagnostics, and subscriptions.

## Tech Stack

### Core Technologies

- **Language**: TypeScript (primary), JavaScript
- **Runtime**: Node.js (version managed via nodenv)
- **Package Manager**: pnpm 10.28.0+ (installed via Corepack)
- **Monorepo Tool**: Turborepo 2.7.4+
- **Version Management**: Changesets for releases

### Frontend

- **Framework**: Next.js (latest)
- **UI Library**: Material-UI (@mui/material)
- **State Management**: React 19.2+
- **Styling**: Emotion (@emotion/react, @emotion/styled)

### Backend

- **Cloud Platform**: Azure
- **Functions**: Azure Functions v4 (@azure/functions)
- **Database**: Azure Cosmos DB (@azure/cosmos)
- **Authentication**: Azure Identity (@azure/identity)

### Infrastructure

- **IaC Tool**: Terraform (version managed via tfenv)
- **CDKTF**: Cloud Development Kit for Terraform (@cdktf/provider-azurerm)
- **Modules**: Custom Terraform modules in `/infra/resources/_modules`

### Testing

- **Test Framework**: Vitest (4.0+)
- **Coverage**: @vitest/coverage-v8
- **Configuration**: `vitest.workspace.ts` for multi-project setup

### Code Quality

- **Linting**: ESLint with @pagopa/eslint-config
- **Type Checking**: TypeScript strict mode
- **Formatting**: Prettier
- **Code Review**: Automated via `pnpm code-review` (runs typecheck, lint:check, test)

### API Development

- **OpenAPI**: OpenAPI specifications in `/docs` folders
- **Codegen**: @pagopa/openapi-codegen-ts for API client/server generation
- **Validation**: io-ts for runtime type validation
- **Functional Programming**: fp-ts for functional utilities

### Observability

- **Tracing**: @pagopa/azure-tracing
- **Logging**: Azure Application Insights
- **Monitoring**: Azure Monitor

### PagoPA Libraries

- **Handler Kit**: @pagopa/handler-kit and @pagopa/handler-kit-azure-func
- **Commons**: @pagopa/ts-commons for shared utilities

## Development Workflow

### Build System

- **Monorepo Scripts**: Defined in root `package.json`
  - `pnpm build` - Build all packages and apps
  - `pnpm typecheck` - Type check all workspaces
  - `pnpm lint` - Lint and fix all workspaces
  - `pnpm test` - Run tests across workspaces
  - `pnpm code-review` - Run full validation (typecheck + lint + test)
  - `pnpm infra:generate` - Generate infrastructure code

- **Turborepo**: Manages task dependencies and caching (see `turbo.json`)
  - Tasks: `clean`, `build`, `typecheck`, `lint`, `lint:check`, `generate`, `test`
  - Caching: Configured per task with inputs/outputs
  - Dependencies: Tasks can depend on other tasks using `dependsOn`

### Package Management

- **Workspace Protocol**: Use `workspace:^` for internal dependencies
- **Catalog**: Centralized version management in `pnpm-workspace.yaml`
  - Use `catalog:` in package.json to reference catalog versions
  - Example: `"@azure/functions": "catalog:"`

### Code Generation

- Run `generate` scripts before building
- OpenAPI client/server code generation from specs
- CDKTF infrastructure code generation

### Release Process

1. Add changeset file when opening PRs with publishable changes: `pnpm changeset`
2. Changesets bot will create/update "Version Packages" PR
3. Merge "Version Packages" PR to publish releases
4. GitHub releases are created automatically for bumped versions

## Coding Guidelines

### TypeScript

- Use **ES Modules** (`"type": "module"` in package.json)
- Enable strict type checking
- Use `io-ts` for runtime validation
- Use `fp-ts` for functional programming patterns
- Prefer explicit types over inference for public APIs
- **Always use English** for all code, comments, documentation, variable names, function names, and commit messages

### Project Organization

- Keep domain logic in `/packages/to-do-domain`
- Keep infrastructure adapters in `/packages/to-do-azure-adapters`
- Azure Function apps: place handlers in `src/` with OpenAPI specs in `docs/`
- Next.js apps: follow Next.js App Router conventions

### Dependencies

- Reference shared packages using workspace protocol: `"@to-do/domain": "workspace:^"`
- Use catalog versions for common dependencies
- Keep Azure SDK versions consistent across projects

### Testing

- Write tests alongside source code
- Use Vitest for unit and integration tests
- Place test data in `__tests__/data.ts` files
- Export test utilities from packages when needed

### Infrastructure

- Define Terraform modules in `/infra/resources/_modules`
- Use CDKTF for complex infrastructure patterns
- Keep environment-specific configs in subdirectories (e.g., `dev/`)
- Document infrastructure decisions in module READMEs

### Azure Functions

- Use @pagopa/handler-kit for consistent handler patterns
- Define OpenAPI specs before implementation
- Use `gen-api-models` for code generation from OpenAPI
- Configure `host.json` and `local.settings.json` appropriately
- Use ESBuild for production artifact bundling

### Next.js Applications

- Use Server Components by default
- Place API client code in `src/lib/client/`
- Generate API clients from OpenAPI specs
- Use Material-UI for consistent styling
- Implement proper error boundaries

## Common Commands

```bash
# Install dependencies
pnpm install

# Run code review (typecheck + lint + test)
pnpm code-review

# Build all apps and packages
pnpm build

# Run tests with coverage
pnpm test:coverage

# Generate infrastructure code
pnpm infra:generate

# Create a changeset
pnpm changeset

# Version packages (handled by CI)
pnpm version

# Tag releases (handled by CI)
pnpm release
```

## Best Practices

1. **Always run `generate` scripts** before building apps that use codegen
2. **Use Turborepo task dependencies** to ensure proper build order
3. **Follow semantic versioning** for all packages and apps
4. **Add changesets** for all user-facing changes
5. **Keep shared logic in packages**, not duplicated in apps
6. **Document OpenAPI specs** before implementing endpoints
7. **Use catalog versions** for consistent dependencies
8. **Test infrastructure changes** in dev environment first
9. **Keep Azure Function host.json** configurations consistent
10. **Use workspace references** for internal package dependencies

## Environment Setup

Ensure you have the following tools installed with version management:

- **Node.js**: Install via `nodenv install`
- **pnpm**: Enable via `corepack enable`
- **Terraform**: Install via `tfenv install`

## Notes for AI Assistance

### Code Quality Requirements

**CRITICAL: All code changes MUST be validated before completion.**

1. **Always produce valid, compilable code**
   - Run `pnpm typecheck` after any TypeScript changes
   - Fix all type errors before considering the task complete
   - Ensure imports are correct and modules are properly referenced

2. **All code changes MUST pass tests**
   - Every new feature or function MUST have unit tests
   - Run `pnpm test` in the relevant workspace after changes
   - Ensure all tests pass before completion
   - Update existing tests when modifying functionality

3. **Run code-review after every change**
   - Execute `pnpm code-review` (typecheck + lint:check + test) after modifications
   - Fix any errors reported by the code-review script
   - Do not consider the task complete until code-review passes

4. **Testing Requirements**
   - Write unit tests for all new functions, classes, and modules
   - Use Vitest for testing with proper assertions
   - Test both success and error cases
   - Mock external dependencies (Azure services, HTTP calls, etc.)
   - Place tests in `__tests__/` directories or alongside source with `.test.ts` suffix
   - Aim for meaningful test coverage, not just quantity

5. **Validation Workflow**

   ```bash
   # After making code changes, ALWAYS run:
   pnpm code-review

   # If working in a specific workspace:
   cd apps/to-do-api && pnpm typecheck && pnpm lint:check && pnpm test
   ```

### Project-Specific Guidelines

- **Use English language only** - All code, comments, documentation, variable names, function names, type definitions, error messages, and commit messages MUST be in English
- When modifying Azure Functions, ensure `host.json` is compatible with v4
- When adding dependencies, check if a catalog version exists first
- When creating new packages, add them to `pnpm-workspace.yaml`
- When modifying infrastructure, update corresponding Terraform modules
- When generating code, ensure source OpenAPI specs are valid
- When adding scripts, consider if they should be in Turborepo pipeline
- Always maintain type safety - avoid `any` types
- Follow fp-ts patterns for error handling (Either, Option, TaskEither)
- Use io-ts for runtime validation of external data
- Prefer pure functions and immutable data structures

### Error Handling

- Never ignore compilation errors
- Never skip test failures
- Never commit code that doesn't pass `pnpm code-review`
- If tests fail, investigate and fix the root cause
- If types don't compile, fix the type errors properly (don't use `any` or `@ts-ignore`)

### Definition of Done

A code change is NOT complete until:

- ✅ Code compiles without errors (`pnpm typecheck` passes)
- ✅ All linting rules pass (`pnpm lint:check` passes)
- ✅ All tests pass (`pnpm test` passes)
- ✅ New functionality has unit tests
- ✅ `pnpm code-review` completes successfully
- ✅ Code follows project conventions and best practices
