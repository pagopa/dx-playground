FROM public.ecr.aws/docker/library/node:20-alpine AS builder

COPY /. /.

RUN yarn workspaces focus
RUN npx turbo prune --docker azure-function-v3

WORKDIR /out/full

RUN yarn config set nodeLinker node-modules
RUN yarn config set nmHoistingLimits workspaces

RUN yarn install --immutable

RUN npx turbo build --filter azure-function-v3

WORKDIR /out/full/apps/azure-function-v3

RUN yarn workspaces focus --production

# To enable ssh & remote debugging on app service change the base image to the one below
# FROM mcr.microsoft.com/azure-functions/node:4-node20-appservice
FROM mcr.microsoft.com/azure-functions/node:4-node20 AS runtime

ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true

WORKDIR /home/site/wwwroot

COPY --from=builder /out/full/apps/azure-function-v3 .

# # Copy package.json and install packages before copying the rest of the code to enable caching
# COPY package.json package.json
# RUN npm install

# # Copy the rest of the code
# COPY . .
