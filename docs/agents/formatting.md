# Code Formatting and Linting

Standards for code style, formatting, and linting across the monorepo.

## Formatting Standards

- **EditorConfig**: 2-space indent, LF line endings, final newline, max line length **80 columns**.
- **Prettier**: Automatically formats code. If commit hooks are present, they run as configured.
- Fix lint errors: `pnpm lint` or `pnpm --filter <pkg> lint` before pushing.

## ESLint Configuration

- **Primary linter**: ESLint with `@pagopa/eslint-config`.
- Prefer these rules unless a package explicitly pins a different config.
- **In CI**, use `lint:check` to validate without auto-fixing.
- For package-level overrides, check `eslint.config.js` in the package directory or the root config.

## Naming and API Design

Part of the TypeScript conventions—see [TypeScript, Types, and Error Handling](./typescript.md#naming-conventions) for detailed naming rules.

Quick reference:

- **camelCase**: variables, functions, properties
- **PascalCase**: types, interfaces, classes (no `I` prefix)
- **UPPER_SNAKE_CASE**: truly global or static constants

## File and Line Length

- Keep **line length under 80 columns** for readability.
- Configure your editor with EditorConfig support (most modern editors support it).

## Related Guidance

For TypeScript-specific style rules, see [TypeScript, Types, and Error Handling](./typescript.md).

For import ordering and module layout, see [TypeScript, Types, and Error Handling](./typescript.md#imports-and-module-layout).
