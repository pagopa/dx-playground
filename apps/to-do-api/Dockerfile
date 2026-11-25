# Build from the repository root with:
# docker build -f apps/to-do-api/Dockerfile -t to-do-api .
FROM node:24-bookworm-slim@sha256:873f586f3794f52281bd039bf02c048a0be08fde619338f9941bad1eb6b34530 AS build

WORKDIR /workspace

RUN corepack enable

COPY . .

RUN pnpm install --frozen-lockfile \
  && pnpm --filter to-do-api clean \
  && pnpm --filter to-do-api generate \
  && pnpm --filter to-do-api... build \
  && pnpm --filter to-do-api deploy --prod /deploy

FROM mcr.microsoft.com/azure-functions/node:4-node24

ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
  AzureFunctionsJobHost__Logging__Console__IsEnabled=true

WORKDIR /home/site/wwwroot

COPY --from=build /deploy/ ./

EXPOSE 80
