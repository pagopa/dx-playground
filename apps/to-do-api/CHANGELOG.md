# to-do-api

## 0.8.1-beta.1

### Patch Changes

- Updated dependencies [3e0fbef]
  - @to-do/domain@0.2.0-beta.1
  - @to-do/azure-adapters@0.1.1-beta.1

## 0.8.1-beta.0

### Patch Changes

- Updated dependencies [2ce8c9f]
  - @to-do/domain@0.2.0-beta.0
  - @to-do/azure-adapters@0.1.1-beta.0

## 0.8.0

### Minor Changes

- 9518915: Move CosmosDB adapter into a separate package

### Patch Changes

- Updated dependencies [9518915]
- Updated dependencies [9518915]
  - @to-do/azure-adapters@0.1.0
  - @to-do/domain@0.1.2

## 0.7.1

### Patch Changes

- 209155a: Move use cases to the `@to-do/domain` package
- Updated dependencies [209155a]
  - @to-do/domain@0.1.1

## 0.7.0

### Minor Changes

- 8849352: Move domain into a separate package (`@todo/domain`)

### Patch Changes

- Updated dependencies [8849352]
  - @to-do/domain@0.1.0

## 0.6.0

### Minor Changes

- 3f56476: Remove OpenTelemetry adapter

## 0.5.11

### Patch Changes

- 3d06c7f: Upgrade dependencies

## 0.5.10

### Patch Changes

- 6994e09: Upgrade vite related dependencies

## 0.5.9

### Patch Changes

- d748c1f: Upgrade minor and patches dependencies

## 0.5.8

### Patch Changes

- 54e1f35: Upgrade PagoPA dependencies

## 0.5.7

### Patch Changes

- 9291f22: Use `@pagopa/azure-tracing` package

## 0.5.6

### Patch Changes

- 0a113af: Send custom events to Application Insights
- 9893889: Fix eslint versions
- Updated dependencies [9893889]
  - azure-functions-otel-instrumentation@0.1.1

## 0.5.5

### Patch Changes

- d20eebd: Upgrade `esbuild` to version `0.25.0`

## 0.5.4

### Patch Changes

- Updated dependencies [032794e]
  - azure-functions-otel-instrumentation@0.1.0

## 0.5.3

### Patch Changes

- 3769c64: Remove Dynatrace configuration

## 0.5.2

### Patch Changes

- 204a50c: Setup Application Insights

## 0.5.1

### Patch Changes

- 138394f: Ignore test files during compilation

## 0.5.0

### Minor Changes

- be69858: [CES-684] Install and configure Dynatrace

### Patch Changes

- ca1845d: [CES-698] Add read secret permission to the azure function

## 0.4.2

### Patch Changes

- a9cccb5: [CES-696] Add Dynatrace env variable to Azure function (API)

## 0.4.1

### Patch Changes

- 991f33a: Add security schema to OpenAPI specification

## 0.4.0

### Minor Changes

- e6d20c9: [CES-647] Add `DELETE /tasks/{id}` operation

## 0.3.0

### Minor Changes

- 964afe1: [CES-644] Add `GET /tasks` to list the tasks
- b8c65cf: [CES-645] Add `GET task/{id}`

## 0.2.1

### Patch Changes

- b7cb10a: [CES-640] Implements adapters used by `POST /tasks`

## 0.2.0

### Minor Changes

- 6172729: [CES-639] Add `POST /tasks` operation

## 0.1.1

### Patch Changes

- 60f49c6: [CES-641] Add `COSMOSDB_TASKS_CONTAINER_NAME` environment variable to the Azure Function

## 0.1.0

### Minor Changes

- f399dc9: [CES-582] Configure Azure function and add `info` endpoint
