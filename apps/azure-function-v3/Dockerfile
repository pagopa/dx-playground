FROM node:20-alpine AS builder

RUN corepack enable

COPY . /app

WORKDIR /app

RUN yarn workspaces focus dx-playground azure-function-v3
RUN yarn turbo build --filter=azure-function-v3...
RUN yarn workspaces focus azure-function-v3 --production

FROM mcr.microsoft.com/azure-functions/node:4-node20

ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true

WORKDIR /home/site/wwwroot

COPY --from=builder /app/apps/azure-function-v3 .

EXPOSE 80
