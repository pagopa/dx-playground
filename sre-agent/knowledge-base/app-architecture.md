# DX To-Do — Application Architecture

## Overview

DX To-Do is a small task management application exposed through
Azure API Management and backed by Azure Cosmos DB.

Main components:

- Frontend: Next.js web app (`apps/to-do-webapp`) running on Azure App Service
- Backend: Azure Functions HTTP API (`apps/to-do-api`) running on Azure
  Function App
- Data store: Azure Cosmos DB (SQL API), `db` database and `tasks` container
- API gateway: Azure API Management with published To Do APIs and backend
  routing

The application follows a layered design:

- UI layer in `to-do-webapp`
- API + orchestration layer in `to-do-api`
- Domain/use-case layer in `packages/to-do-domain`
- Infrastructure adapter layer for Cosmos DB in
  `packages/to-do-azure-adapters`

## Runtime Topology

- Client browser interacts with Next.js UI
- Next.js server actions call APIM endpoints using generated OpenAPI client
- APIM validates subscription access and forwards requests to Function App
- Function App handlers execute domain use cases
- Cosmos adapter performs CRUD operations on the `tasks` container

## Request Flow

1. User action in UI (create/list/get/delete task)
2. Frontend server action invokes generated API client
3. Request goes to APIM (`/todo/...` or `/v3/...`)
4. APIM forwards to Azure Function backend and applies gateway policies
5. Function handler validates input and executes domain use case
6. Domain uses `TaskRepository` abstraction
7. Cosmos adapter executes query/read/create/delete
8. Response returns from Function -> APIM -> Frontend -> Browser

## API Endpoints

Primary To Do operations exposed through APIM and implemented by Azure
Functions:

| Endpoint          | Method | Description                            | Backend handler |
| ----------------- | ------ | -------------------------------------- | --------------- |
| `/info`           | GET    | Service info and basic health response | `info`          |
| `/tasks`          | GET    | List all tasks                         | `getTaskList`   |
| `/tasks`          | POST   | Create a task                          | `createTask`    |
| `/tasks/{taskId}` | GET    | Get a task by id                       | `getTaskById`   |
| `/tasks/{taskId}` | DELETE | Delete a task by id                    | `deleteTask`    |

Published APIM paths in artifacts:

- `todo` (`To Do API`)
- `v3` (`To Do API - V3`)

## Data Model (Cosmos)

Task entity persisted in Cosmos DB:

- `id`: task identifier (also partition key)
- `title`: task text
- `state`: one of `INCOMPLETE`, `COMPLETED`, `DELETED`

Storage details:

- Database: `db`
- Container: `tasks`
- Partition key: `/id`
- Current list operation issues `SELECT * FROM c`

## APIM Integration

APIM is the public entry point for the API.

Gateway behavior relevant for SRE:

- Subscription key required for consumer access
- Backend mapping to Function Apps through APIM backends
- URI rewrite to append backend base path before forwarding
- CORS policy currently allows all origins, methods, and headers
- APIM monitoring and logging are enabled via Azure Monitor / App Insights

Backends configured in artifacts:

- `to-do-api-azure-function`
- `to-do-api-azure-function-v3`

## Security Model

- Frontend uses APIM subscription key when invoking gateway APIs
- APIM authenticates to Function backend with function key
- Function App is configured with Entra ID authentication allowing APIM as
  caller
- Function App identity has Cosmos DB data-plane writer access and Key Vault
  secret-reader access
- Web app identity has APIM read access and Key Vault secret-reader access

## Observability

- Azure tracing hooks are registered in Azure Functions
- Custom events are emitted for key operations and failures, for example:
  - task creation success/failure
  - task list fetch failure
  - task fetch failure
  - task deletion failure
- APIM diagnostics are enabled and sent to centralized monitoring
- Health-check endpoint for backend is `/api/info`

## Failure Domains and Typical Incident Scenarios

1. APIM issues
   - Symptoms: 401/403/5xx at gateway, no backend invocation
   - Checks: APIM backend health, policies, subscription access, diagnostics

2. Function App issues
   - Symptoms: 5xx from backend, timeout, cold start spikes
   - Checks: Function logs, auth configuration, deployment slot state,
     dependency availability

3. Cosmos DB issues
   - Symptoms: read/write failures, increased latency, throttling
   - Checks: Cosmos metrics, RU/s pressure, partition hot spots, role
     assignments

4. Frontend integration issues
   - Symptoms: empty task list or failed create/delete from UI
   - Checks: server action errors, API client connectivity through APIM,
     response status handling

## Key Files

| Path                                                           | Purpose                                        |
| -------------------------------------------------------------- | ---------------------------------------------- |
| `apps/to-do-webapp/src/app/page.tsx`                           | Main To Do page and client-side state updates  |
| `apps/to-do-webapp/src/lib/api.ts`                             | Server actions that call generated API client  |
| `apps/to-do-webapp/src/lib/client.ts`                          | API client setup and auth defaults             |
| `apps/to-do-api/src/main.ts`                                   | Azure Functions registration and route mapping |
| `apps/to-do-api/src/adapters/azure/functions/create-task.ts`   | Create task handler                            |
| `apps/to-do-api/src/adapters/azure/functions/get-tasks.ts`     | List tasks handler                             |
| `apps/to-do-api/src/adapters/azure/functions/get-task.ts`      | Get task handler                               |
| `apps/to-do-api/src/adapters/azure/functions/delete-task.ts`   | Delete task handler                            |
| `packages/to-do-domain/src/Task.ts`                            | Domain task model                              |
| `packages/to-do-domain/src/TaskRepository.ts`                  | Repository contract + operations               |
| `packages/to-do-azure-adapters/src/cosmosdb/TaskRepository.ts` | Cosmos implementation of task repository       |
| `infra/resources/dev/cosmos.tf`                                | Cosmos account/database/container provisioning |
| `infra/resources/dev/function_app.tf`                          | Function App provisioning and access bindings  |
| `infra/resources/dev/app_service.tf`                           | Web app provisioning and integration with APIM |
| `infra/resources/dev/apim.tf`                                  | APIM provisioning and To Do API publishing     |
| `apimartifacts/apis/to-do-api/specification.json`              | Published OpenAPI for `todo` path              |
| `apimartifacts/apis/to-do-api-v3/specification.json`           | Published OpenAPI for `v3` path                |

## Deployment Notes

- Monorepo managed with pnpm workspaces and Turborepo
- Backend and frontend are independently deployable units
- APIM artifacts represent gateway-side API contract and backend bindings
- Infrastructure is managed through Terraform modules under `infra/resources`

## What This Document Covers

This knowledge document is focused on:

- To Do frontend
- To Do backend
- Cosmos DB persistence
- APIM gateway layer

It intentionally excludes detailed environment variable inventories.
