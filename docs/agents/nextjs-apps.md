# Next.js Applications

Guidelines and patterns for Next.js web applications in this monorepo.

## Next.js Stack

- **Framework**: Next.js (latest with App Router)
- **UI Library**: Material-UI (@mui/material)
- **State Management**: React 19.2+
- **Styling**: Emotion (@emotion/react, @emotion/styled)

## Structuring Next.js Apps

Place Next.js apps in `/apps/`:

```
apps/to-do-webapp/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   └── [id]/
│   │       └── page.tsx         # Dynamic route
│   ├── lib/
│   │   ├── client/              # API client code (generated)
│   │   │   └── todoClient.ts
│   │   └── utils.ts
│   ├── components/
│   │   ├── TodoList.tsx
│   │   └── TodoForm.tsx
│   └── __tests__/
│       └── components/
│           └── TodoList.test.tsx
├── public/                      # Static assets
├── next.config.js
├── tsconfig.json
└── package.json
```

## Server Components

Use **Server Components by default**:

```typescript
// src/app/page.tsx (Server Component)
import { TodoList } from "@/components/TodoList";

export default async function Home() {
  const todos = await fetch("https://api.example.com/todos");
  return <TodoList initial={todos} />;
}
```

Benefits:
- Reduced JavaScript sent to browser
- Direct database access (no API overhead)
- Sensitive data stays on server
- Better performance

## API Client Code

Place generated API clients in `src/lib/client/`:

```
src/lib/client/
├── todoClient.ts        # Generated from OpenAPI
└── index.ts
```

Generate from OpenAPI spec:

```bash
pnpm run generate
```

Use in Server Components:

```typescript
import { getTodos } from "@/lib/client/todoClient";

export default async function TodoPage() {
  const todos = await getTodos();
  return <div>{/* render todos */}</div>;
}
```

## Styling with Material-UI and Emotion

Combine Material-UI with Emotion for consistent, typed styling:

```typescript
import { styled } from "@emotion/react";
import { Box, Button } from "@mui/material";

const StyledContainer = styled(Box)`
  padding: 2rem;
  background-color: #f5f5f5;
`;

export function TodoForm() {
  return (
    <StyledContainer>
      <Button variant="contained">Add Todo</Button>
    </StyledContainer>
  );
}
```

Benefits:
- Typed components from Material-UI
- Flexible styling with Emotion
- Consistent design tokens
- Easy to maintain

## Error Handling

Implement error boundaries and pages:

```typescript
// src/app/error.tsx
"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

Also implement:
- `src/app/not-found.tsx` – 404 page
- `src/app/loading.tsx` – Loading UI (Suspense boundaries)

## Environment Variables

Store configuration in `.env.local` (not committed):

```
NEXT_PUBLIC_API_URL=http://localhost:7071
DATABASE_URL=server://...
```

Access in code:

```typescript
// Public variables (exposed to browser)
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Private variables (server-side only)
const dbUrl = process.env.DATABASE_URL;
```

## Testing

Test components with Vitest and React Testing Library:

```typescript
import { render, screen } from "@testing-library/react";
import { TodoList } from "./TodoList";

it("renders todo items", () => {
  render(<TodoList todos={[{ id: "1", title: "Test" }]} />);
  expect(screen.getByText("Test")).toBeInTheDocument();
});
```

## Performance Optimization

1. **Image optimization**: Use `<Image>` component (auto-optimization)
2. **Font optimization**: Load fonts from `next/font`
3. **Bundle analysis**: Use `@next/bundle-analyzer`
4. **Route prefetching**: Automatic for links in viewport
5. **Code splitting**: Automatic for dynamic imports

Example:

```typescript
import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Page() {
  return (
    <>
      <Image src="/hero.png" alt="Hero" width={800} height={600} />
      <p className={inter.className}>Welcome</p>
    </>
  );
}
```

## Best Practices

1. **Use Server Components** by default
2. **Place API clients in `src/lib/client/`** (generated from OpenAPI)
3. **Keep components small and focused**
4. **Use Material-UI + Emotion** for consistent styling
5. **Implement error boundaries** and error pages
6. **Test components in isolation**
7. **Use environment variables** for configuration
8. **Optimize images** with `<Image>`
9. **Load fonts** with `next/font`
10. **Follow Next.js App Router conventions**

## Related Guidance

For testing patterns, see [Testing Patterns](./testing.md).

For styling standards, see [Code Formatting and Linting](./formatting.md).

For project organization, see [Project Organization](./project-organization.md).
