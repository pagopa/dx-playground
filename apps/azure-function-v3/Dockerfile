FROM public.ecr.aws/docker/library/node:20-alpine AS builder

COPY . /workspace

WORKDIR /workspace

RUN corepack enable

RUN yarn config set nodeLinker node-modules
RUN yarn config set nmHoistingLimits workspaces
RUN yarn workspaces focus

RUN npx turbo prune azure-function-v3

WORKDIR /workspace/out

RUN yarn install --immutable
RUN npx turbo build --filter azure-function-v3
RUN yarn workspaces focus azure-function-v3 --production

# To enable ssh & remote debugging on app service change the base image to the one below
# FROM mcr.microsoft.com/azure-functions/node:4-node20-appservice
FROM mcr.microsoft.com/azure-functions/node:4-node20 AS runtime

ENV AzureWebJobsScriptRoot=/home/site/apps/azure-function-v3 \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true

COPY --from=builder /workspace/out/ /home/site/

WORKDIR /home/site/apps/azure-function-v3

EXPOSE 80

# # Copy package.json and install packages before copying the rest of the code to enable caching
# COPY package.json package.json
# RUN npm install

# # Copy the rest of the code
# COPY . .
