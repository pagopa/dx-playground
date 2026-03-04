# Project Structure

Overview of the monorepo's directory layout and module organization.

## High-Level Structure

```
dx-playground/
├── apps/              # Deployable applications
├── packages/          # Shared, reusable modules
├── infra/             # Infrastructure-as-code
├── apimartifacts/     # Azure API Management configs
└── docs/              # Documentation
```

## `/apps` — Deployable Applications

Contains standalone applications that produce deployable artifacts.

- **azure-function-v3/** – Azure Function application (v3)
- **test-durable-function/** – Azure Durable Functions implementation
- **to-do-api/** – Azure Function REST API for To Do List (main API service)
- **to-do-webapp/** – Next.js web application for To Do List UI
- **new-webapp/** – Next.js web application
- **test-opex-api/** – Test API for operational excellence

## `/packages` — Shared, Reusable Modules

Contains TypeScript modules consumed by apps. Packages with `private: true` are internal only; others are publishable to registries.

- **to-do-domain/** – Domain logic and business rules
- **to-do-azure-adapters/** – Azure-specific adapters
- **cdktf-monitoring-stack/** – CDKTF constructs for monitoring
- **opex-common/** – Operational excellence utilities
- **typescript-config-node/** – Shared TypeScript config (Node.js)
- **typescript-config-react/** – Shared TypeScript config (React)

## `/infra` — Infrastructure-as-Code

Terraform/CDKTF for Azure resources and deployment environments.

- **bootstrapper/** – Bootstrap scripts for environment setup
- **repository/** – Repository-level infrastructure
- **resources/** – Main infrastructure resources and modules
  - **_modules/** – Custom Terraform modules

## `/apimartifacts` — Azure API Management

Configurations for APIs, backends, policies, diagnostics, and subscriptions.

## Related Guidance

For organization guidelines (where to place code), see [Project Organization](./project-organization.md).

For tech stack details, see [Tech Stack](./tech-stack.md).
