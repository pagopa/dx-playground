# Code style

- Do not add jsdoc comments (/** ... */); TypeScript typing is sufficient.
- Use C block syntax (/* ... */) for method-level comments.
- Use C++ style comments (// ...) for inline comments (within method body).
- Nullable or boolean arguments are code smells; prefer configuration objects as arguments.
- Avoid casts and check if a cast is really necessary; do not use unnecessary casts.
- Always remove legacy and unreachable code.
- Avoid creating overly complex or large methods/modules; split into smaller, manageable functions with clear naming.
- Comment unclear code sections with C block comments explaining the reason for the code and, when applicable, the input and output produced.
