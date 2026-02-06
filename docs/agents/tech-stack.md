# Tech Stack

Overview of technologies and libraries used in this monorepo.

## Core Technologies

- **Language**: TypeScript (primary), JavaScript
- **Runtime**: Node.js (version managed via nodenv)
- **Package Manager**: pnpm 10.28.0+ (Corepack enabled)
- **Monorepo Tool**: Turborepo 2.7.4+ (task orchestration, caching)
- **Version Management**: Changesets for releases

## Frontend Stack

- **Framework**: Next.js (latest with App Router)
- **UI Library**: Material-UI (@mui/material)
- **State Management**: React 19.2+
- **Styling**: Emotion (@emotion/react, @emotion/styled)

## Backend and API Stack

- **Cloud Platform**: Azure
- **Compute**: Azure Functions v4 (@azure/functions)
- **Database**: Azure Cosmos DB (@azure/cosmos)
- **Authentication**: Azure Identity (@azure/identity)
- **OpenAPI**: Specifications in `/docs` folders; codegen via @pagopa/openapi-codegen-ts
- **Runtime Validation**: io-ts (runtime type validation)
- **Functional Programming**: fp-ts (functional utilities)

## Infrastructure Stack

- **IaC Tool**: Terraform (version managed via tfenv)
- **Terraform CDK**: CDKTF with @cdktf/provider-azurerm
- **Modules**: Custom Terraform modules in `/infra/resources/_modules`

## Testing Stack

- **Test Framework**: Vitest 4.0+
- **Coverage**: @vitest/coverage-v8
- **Config**: `vitest.workspace.ts` for multi-project setup

## Code Quality Tools

- **Linting**: ESLint with @pagopa/eslint-config
- **Type Checking**: TypeScript (strict mode)
- **Formatting**: Prettier
- **Code Review**: `pnpm code-review` (typecheck + lint:check + test)

## Observability

- **Tracing**: @pagopa/azure-tracing
- **Logging**: Azure Application Insights
- **Monitoring**: Azure Monitor

## PagoPA Libraries

- **Handler Kit**: @pagopa/handler-kit, @pagopa/handler-kit-azure-func (consistent handler patterns)
- **Commons**: @pagopa/ts-commons (shared utilities)

## Related Guidance

For build and test commands, see [Build, Test, and Lint Commands](./commands.md).

For TypeScript patterns (io-ts, fp-ts), see [TypeScript, Types, and Error Handling](./typescript.md).
