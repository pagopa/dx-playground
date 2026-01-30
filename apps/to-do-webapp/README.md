This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
pnpm run dev
# or
pnpm dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Environment

This app expects several server-only environment variables to be set before running. To avoid accidental leaks, do not commit `.env.local` with secrets. Create a local file from your environment or use your secrets manager.

Required variables (server-only):

- `API_BASE_URL` — base URL of the backend API
- `API_BASE_PATH` — base path used by the generated API client
- `API_KEY` — API key for server-to-server calls (keep secret)

When running locally you can copy a provided example (if present) or create `.env.local` yourself:

```bash
# create a local env and edit values
cp .env.local.example .env.local 2>/dev/null || true
# then edit .env.local to set API_BASE_URL/API_BASE_PATH/API_KEY
```

The app validates required env vars on the server at startup and will fail fast with a clear error if any are missing.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
