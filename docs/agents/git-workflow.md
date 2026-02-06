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

- ✅ Typecheck passes (`pnpm typecheck`)
- ✅ Linting passes (`pnpm lint:check`)
- ✅ All tests pass (`pnpm test`)
- ✅ New functionality has unit tests
- ✅ `pnpm code-review` completes successfully
- ✅ Code follows conventions in related docs (formatting, TypeScript, testing)

## English-Only Requirement

All code, comments, documentation, variable names, function names, type definitions, error messages, and commit messages **MUST be in English**.

This is a global requirement across all tasks and files.

## Additional Notes

For detailed information about the project structure and architecture context, see `.github/copilot-instructions.md`.
