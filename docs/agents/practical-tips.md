# Practical Tips for Agents

Optimization strategies and workflow patterns for efficient development in this monorepo.

## Dependency Patterns

When adding or updating dependencies:

### Catalog Versions

Check `pnpm-workspace.yaml` for existing versions and use `catalog:` to reference them:

```json
{
  "@azure/functions": "catalog:",
  "@azure/cosmos": "catalog:",
  "io-ts": "catalog:"
}
```

This ensures consistency across all workspaces.

### Workspace References

For internal packages, use the workspace protocol:

```json
{
  "@to-do/domain": "workspace:^",
  "@to-do/azure-adapters": "workspace:^"
}
```

### Azure SDK Consistency

Keep Azure SDK versions consistent across projects to avoid compatibility issues:
- Don't mix v3 and v4 of the same package
- Use the same version in all packages that depend on a given Azure SDK

## Best Practices

1. **Always run `pnpm generate`** before building packages that use code generation
2. **Use Turborepo task dependencies** (defined in `turbo.json`) to ensure proper build order
3. **Follow semantic versioning** for all packages and apps
4. **Keep shared logic in packages**, not duplicated in apps
5. **Document OpenAPI specs** before implementing endpoints
6. **Use catalog versions** for consistent dependencies across workspaces
7. **Test infrastructure changes** in dev environment first
8. **Use workspace references** for internal package dependencies
9. **Run code-review before creating PRs** to catch issues early
10. **Keep Azure Function host.json v4 compatible** when upgrading

## Finding Conventions

When unsure about conventions, check these locations:

- **ESLint configs**: `eslint.config.js` in the package, or root config. Prefer `@pagopa/eslint-config` unless a package pins a different config.
- **TypeScript configs**: `tsconfig.json` in each workspace; shared configs in `@pagopa/typescript-config-node` or `typescript-config-react` packages.
- **CI scripts and pipelines**: `.github/workflows/*` shows how CI runs checks and can clarify required conventions.

## Best Practices Summary

1. **Always run `pnpm generate`** before building packages that use code generation.
2. **Use Turborepo task dependencies** (see `turbo.json`) to ensure proper build order.
3. **Follow semantic versioning** for all packages and apps.
4. **Keep shared logic in packages**, not duplicated in apps.
5. **Document OpenAPI specs** before implementing endpoints.
6. **Use catalog versions** for consistent dependencies.
7. **Test infrastructure changes** in dev environment first.
8. **Keep Azure Function host.json** configurations consistent.
9. **Use workspace references** for internal package dependencies.
10. **Run code-review before creating PRs** to catch issues early.

## Handling Uncertainty

If something is ambiguous after checking relevant documentation:

1. Make a best-effort change following the conventions above.
2. Run the checks (`pnpm code-review`).
3. If still uncertain, open a small PR with the change and ask for human review.

## Related Guidance

- For detailed command usage, see [Build, Test, and Lint Commands](./commands.md)
- For Definition of Done and PR requirements, see [Git Workflow and PR Requirements](./git-workflow.md)
- For project structure and organization, see [Project Structure](./project-structure.md) and [Project Organization](./project-organization.md)
- For framework-specific patterns, see [Azure Functions](./azure-functions.md) and [Next.js Applications](./nextjs-apps.md)
