# Infrastructure Patterns

Guidelines for writing infrastructure-as-code in this monorepo.

## Infrastructure Tools

- **Terraform**: Version managed via tfenv. For declarative, static infrastructure.
- **CDKTF**: Cloud Development Kit for Terraform (@cdktf/provider-azurerm). For dynamic, parameterized infrastructure.

## Terraform Modules

### Module Organization

Define Terraform modules in `/infra/resources/_modules/`:

```
_modules/
├── monitoring/      # Application Insights, Log Analytics
├── networking/      # VNets, subnets, security groups
├── storage/         # Storage accounts, blob containers
└── compute/         # Function apps, App Service plans
```

Each module should include:
- `variables.tf` – Input parameters
- `main.tf` – Resource definitions
- `outputs.tf` – Output values
- `README.md` – Documentation of purpose, inputs, outputs

### Module Guidelines

- **No hardcoding**: Use variables for all configuration
- **Self-contained**: Each module should be independently deployable
- **Documented**: Include README with usage examples
- **Versioned**: Use semantic versioning for modules when published

## Environment-Specific Configuration

Organize environments in separate directories:

```
infra/resources/
├── _modules/        # Reusable modules
├── dev/             # Development environment
│   └── main.tf
├── staging/         # Staging environment
│   └── main.tf
└── prod/            # Production environment
    └── main.tf
```

Each environment calls shared modules with environment-specific variables.

## CDKTF Infrastructure

Use CDKTF (`@cdktf/provider-azurerm`) for:
- Complex resource orchestration
- Dynamic resource generation (loops, conditionals)
- Type-safe infrastructure (TypeScript benefits)

Organize CDKTF code in `packages/cdktf-monitoring-stack/`:

```typescript
// Define constructs for reusability
export class MonitoringStack extends TerraformStack {
  constructor(scope: Construct, id: string, config: MonitoringConfig) {
    // Resource definitions here
  }
}
```

Benefits:
- Full TypeScript type safety
- Reusable constructs (similar to CDK)
- Integration with CI/CD pipelines

## Best Practices

1. **Test infrastructure changes** in dev environment first
2. **Keep Azure SDK versions consistent** across projects
3. **Document infrastructure decisions** in module READMEs
4. **Use variables** for environment-specific config (no hardcoding)
5. **Plan before applying**: Run `terraform plan` and review changes
6. **Avoid manual infrastructure changes**: All changes via Terraform/CDKTF
7. **Use state locking**: Enable remote state with locking in CI/CD

## Related Guidance

For testing infrastructure code, see [Testing Patterns](./testing.md).

For tech stack details, see [Tech Stack](./tech-stack.md).
