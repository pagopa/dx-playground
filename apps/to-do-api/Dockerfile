# Build from the repository root with:
# docker build -f apps/to-do-api/Dockerfile -t to-do-api .
FROM node:24-bookworm-slim@sha256:01d566e8d94d8c619591d78652babfccd3c6992a3dffa9ed5ab39e11cf6c70e9 AS build

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
