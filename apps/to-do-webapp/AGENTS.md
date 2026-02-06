# Next.js Web App Workspace: `to-do-webapp`

Next.js web application with Material-UI styling. Related: [`@to-do/domain`](../../packages/to-do-domain), [`@to-do/azure-adapters`](../../packages/to-do-azure-adapters).

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
├── lib/client/         # Generated API clients (from OpenAPI)
├── components/         # React components
└── __tests__/          # Component tests

next.config.js
```

## Workspace-Specific Guidelines

**Server vs Client Components (Next.js App Router)**

- Use Server Components by default (no `"use client"`)
- Only add `"use client"` when needing hooks or event handlers
- Fetch data server-side in Server Components
- See [Next.js Guide](../../docs/agents/nextjs-apps.md) for patterns

**Styling Strategy**

- Use Material-UI (`@mui/material`) for components
- Use Emotion (`@emotion/react`) for custom styling
- Keep styles co-located with components
- Example: Import from Material-UI, customize with Emotion

**API Integration**

- API clients are generated from OpenAPI specs
- Place generated clients in `src/lib/client/`
- Use in Server Components for data fetching
- See [Next.js Guide](../../docs/agents/nextjs-apps.md) for integration patterns

**Error Handling & Pages**

- Implement `src/app/error.tsx` for error boundaries
- Implement `src/app/not-found.tsx` for 404 pages
- Use Suspense boundaries for loading states

**Environment Variables**

- `NEXT_PUBLIC_*`: Exposed to browser
- Others: Server-only (secrets, API keys)
- Use `.env.local` for local development

## Additional Resources

- [Build, Test, and Lint Commands](../../docs/agents/commands.md)
- [Next.js Applications Guide](../../docs/agents/nextjs-apps.md)
- [Project Organization](../../docs/agents/project-organization.md)
- [Root AGENTS.md](../../AGENTS.md) – Essential requirements and detailed guidance index
