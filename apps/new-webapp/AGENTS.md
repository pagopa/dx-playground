# Next.js Web App Workspace

Next.js web application with Material-UI styling. Related: Domain and Azure adapters packages.

## Workspace-Specific Commands

| Command            | Purpose                                                  |
| ------------------ | -------------------------------------------------------- |
| `pnpm dev`         | Start dev server with hot reload (http://localhost:3000) |
| `pnpm build`       | Build for production                                     |
| `pnpm start:clean` | Start production build (local testing)                   |

## Workspace-Specific Structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   ├── error.tsx       # Error boundary
│   └── [id]/page.tsx   # Dynamic routes
├── lib/client/         # Generated API clients
├── components/         # React components
└── __tests__/          # Component tests
```

## Workspace-Specific Guidelines

**Server vs Client Components**

- Use Server Components by default (no `"use client"`)
- Only add `"use client"` for hooks or event handlers
- Fetch data server-side in Server Components
- See [Next.js Guide](../../docs/agents/nextjs-apps.md)

**Styling**

- Use Material-UI (`@mui/material`) for components
- Use Emotion (`@emotion/react`) for custom styling
- Keep styles co-located with components

**API Integration**

- API clients generated from OpenAPI specs
- Place in `src/lib/client/`
- Use in Server Components for data fetching

**Error Handling & Pages**

- Implement `src/app/error.tsx` for error boundaries
- Implement `src/app/not-found.tsx` for 404 pages

**Environment Variables**

- `NEXT_PUBLIC_*`: Exposed to browser
- Others: Server-only (secrets, API keys)
- Use `.env.local` for local development

## Additional Resources

- [Build, Test, and Lint Commands](../../docs/agents/commands.md)
- [Next.js Applications Guide](../../docs/agents/nextjs-apps.md)
- [TypeScript Guide](../../docs/agents/typescript.md)
- [Root AGENTS.md](../../AGENTS.md) – Essential requirements and detailed guidance index
