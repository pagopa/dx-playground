# Infrastructure Workspace: `infra/resources`

Infrastructure-as-code for Azure resources using Terraform and CDKTF. Manages dev, staging, and production environments.

## Workspace-Specific Commands

| Command                                  | Purpose                                 |
| ---------------------------------------- | --------------------------------------- |
| `pnpm infra:generate`                    | Generate Terraform from CDKTF (if used) |
| `terraform validate`                     | Check Terraform syntax                  |
| `terraform plan -var-file=ENV.tfvars`    | Preview changes (safe)                  |
| `terraform apply -var-file=ENV.tfvars`   | Apply changes (requires approval)       |
| `terraform destroy -var-file=ENV.tfvars` | Destroy resources (careful!)            |

## Workspace-Specific Structure

```
resources/
├── _modules/              # Shared Terraform modules
│   ├── monitoring/        # Application Insights, Log Analytics
│   ├── networking/        # VNets, subnets
│   └── storage/           # Storage accounts
├── dev/                   # Development environment
├── staging/               # Staging environment
└── prod/                  # Production environment
```

## Workspace-Specific Guidelines

**Terraform Modules**

- One module per concern (monitoring, networking, storage, etc.)
- Use variables; never hardcode values
- Document inputs/outputs in module `README.md`
- Store in `resources/_modules/<concern>/`

**Environment-Specific Configuration**

- Keep `dev/`, `staging/`, `prod/` separate
- Use `.tfvars` files for environment values
- Never commit secrets (use Azure Key Vault)
- Use remote state (Azure Storage or Terraform Cloud) – never commit `.tfstate`

**Resource Naming**

- Use consistent naming: `env-service-resource`
- Example: `dev-app-insights`, `prod-storage`
- Use lowercase with hyphens (Terraform standard)

**CDKTF Workflow** (if using CDKTF)

- Define constructs in TypeScript
- Generate Terraform: `pnpm infra:generate`
- Commit generated `.tf` files (not `.cdktf.json`)
- TypeScript constructs are source of truth

**Testing Infrastructure**

- Test in dev environment first
- Use `terraform plan` to preview all changes
- Verify: resources created, config correct, connectivity works
- Include `terraform plan` output in PR description

**Secrets & Security**

- Never commit secrets to Git
- Use Azure Key Vault for sensitive values
- Reference via Terraform variables and CI/CD environment variables
- Run plan/apply in CI/CD pipeline (not locally)

## Additional Resources

- [Build, Test, and Lint Commands](../../docs/agents/commands.md)
- [Infrastructure Guide](../../docs/agents/infrastructure.md) – Terraform patterns, CDKTF, module design
- [Project Organization](../../docs/agents/project-organization.md)
- [Root AGENTS.md](../../AGENTS.md) – Essential requirements and detailed guidance index
