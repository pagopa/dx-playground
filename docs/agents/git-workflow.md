# Git Workflow and PR Requirements

Guidelines for pull requests, changesets, and the Definition of Done.

## Pre-PR Checklist

**Always run `pnpm code-review` before creating or updating a pull request.**

If code-review fails, fix the issues before pushing.

## Changesets and Versioning

- **Add a changeset** for any package that changes or has a version bump: `pnpm changeset`
- Follow the Changesets workflow; the bot will create/update a "Version Packages" PR when changesets are present.
- Merge the "Version Packages" PR to publish releases; GitHub releases are created automatically.

## Definition of Done

A code change is **complete** only when:

- ✅ Code compiles without errors (`pnpm typecheck` passes)
- ✅ All linting rules pass (`pnpm lint:check` passes)
- ✅ All tests pass (`pnpm test` passes)
- ✅ New functionality has unit tests
- ✅ `pnpm code-review` completes successfully
- ✅ Code follows project conventions and best practices

### Code Quality Requirements

**All code changes MUST be validated before completion**:

1. **Always produce valid, compilable code**
   - Run `pnpm typecheck` after any TypeScript changes
   - Fix all type errors before considering the task complete
   - Ensure imports are correct and modules are properly referenced

2. **All code changes MUST pass tests**
   - Every new feature or function MUST have unit tests
   - Run `pnpm test` in the relevant workspace after changes
   - Ensure all tests pass before completion
   - Update existing tests when modifying functionality

3. **Validate with code-review**
   - Execute `pnpm code-review` (typecheck + lint:check + test) after modifications
   - Fix any errors reported by the code-review script
   - Do not consider the task complete until code-review passes

4. **Error Handling**
   - Never ignore compilation errors
   - Never skip test failures
   - Never commit code that doesn't pass `pnpm code-review`
   - If tests fail, investigate and fix the root cause
   - If types don't compile, fix the type errors properly (don't use `any` or `@ts-ignore`)

## English-Only Requirement

All code, comments, documentation, variable names, function names, type definitions, error messages, and commit messages **MUST be in English**.

This is a global requirement across all tasks and files.

## Additional Notes

For project structure and organization patterns, see [Project Structure](./project-structure.md) and [Project Organization](./project-organization.md).
