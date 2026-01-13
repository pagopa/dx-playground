# @infra/resources

## 1.3.4

### Patch Changes

- [#313](https://github.com/pagopa/dx-playground/pull/313) [`179d365`](https://github.com/pagopa/dx-playground/commit/179d3658fd2cc11a1a08e1395bdb01e37eaadadf) Thanks [@kin0992](https://github.com/kin0992)! - Upgrade API Management module to the latest major version

## 1.3.3

### Patch Changes

- [#315](https://github.com/pagopa/dx-playground/pull/315) [`fae7e90`](https://github.com/pagopa/dx-playground/commit/fae7e90929dfbc23edfe48b427a3bae9b263d3b4) Thanks [@kin0992](https://github.com/kin0992)! - Upgrade AppService module to latest major version

## 1.3.2

### Patch Changes

- [#314](https://github.com/pagopa/dx-playground/pull/314) [`901fb6f`](https://github.com/pagopa/dx-playground/commit/901fb6fcdc319f8f8c4059351f1dea34f4215e58) Thanks [@kin0992](https://github.com/kin0992)! - Upgrade Function App module to latest major version

## 1.3.1

### Patch Changes

- fda1db4: Set `NODE_OPTIONS` environment variable

## 1.3.0

### Minor Changes

- de14023: Create API for Azure Function V3

### Patch Changes

- de14023: Redirect APIM traffic to the Azure Function V3

## 1.2.1

### Patch Changes

- 5f7c4e7: Add env variables to Function App that hosts Azure Function V3

## 1.2.0

### Minor Changes

- 583571b: Create function app to run legacy v3 Azure Function

## 1.1.0

### Minor Changes

- 04e0697: Improve AI (internal) Terraform module
  Create new AI for the azure function v3

## 1.0.0

### Major Changes

- 5bc0f60: Bump to a next major of the role assignment module

### Patch Changes

- 5bc0f60: Set only major as terraform module version

## 0.9.7

### Patch Changes

- 9291f22: Change value of `NODE_OPTIONS` environment variable

## 0.9.6

### Patch Changes

- e2c272c: Enable APIM monitoring to send logs and metrics to Log Analytics workspace

## 0.9.5

### Patch Changes

- 028c68b: Add environment variable to App Service

## 0.9.4

### Patch Changes

- 70e7d63: Remove `set-header` from the policy and handle that within the backend resource

## 0.9.3

### Patch Changes

- a9f8263: Enable Application Insights on APIM

## 0.9.2

### Patch Changes

- 60a9b07: Enable Application Insights on App Service

## 0.9.1

### Patch Changes

- 59825ed: Update module's sources using the new Terraform Registry

## 0.9.0

### Minor Changes

- 0cccced: Upgrade Terraform Azure provider

## 0.8.1

### Patch Changes

- 032794e: Add `NODE_OPTIONS` as environment variable for Azure Function

## 0.8.0

### Minor Changes

- 260055f: Removed all Terraform resources for Dynatrace

### Patch Changes

- 3769c64: Remove Dynatrace configuration

## 0.7.0

### Minor Changes

- 204a50c: Create Application Insights resources

### Patch Changes

- fe7f850: Set Azure Function sampling percentage for Application Insights
- 29165f5: Reference module from Terraform registry

## 0.6.10

### Patch Changes

- f076a22: Get module from Terraform registry. The referenced branch no longer exists.

## 0.6.9

### Patch Changes

- ca1845d: [CES-698] Add read secret permission to the azure function
- d055f0c: Updated tags

## 0.6.8

### Patch Changes

- a9cccb5: [CES-696] Add Dynatrace env variable to Azure function (API)

## 0.6.7

### Patch Changes

- 768d07c: Fix subnet CIDR allocation for Durable Function.

## 0.6.6

### Patch Changes

- 991f33a: Add security schema to OpenAPI specification
- 084e3b3: Use webapp homepage as health_check_path

## 0.6.5

### Patch Changes

- 47864ee: [CES-675] Add API_KEY as environment variable
  Use the approach explained in [Azure documentation here](https://learn.microsoft.com/en-us/azure/app-service/app-service-key-vault-references?tabs=azure-cli)

## 0.6.4

### Patch Changes

- 6412caa: [CES-671] Grant app service permission to read APIM
- 9f933fa: [CES-672] Add environment variables to app service
- cf3eaff: [CES-674] Add app service permission to read secrets from key vault

## 0.6.3

### Patch Changes

- 7ca8f8e: [CES-656] Add `x-functions-key` header in APIM policy

## 0.6.2

### Patch Changes

- 6801b26: [CES-655] Create a named value with the To Do API Function key

## 0.6.1

### Patch Changes

- 418359b: [CES-654] Permit APIM to read secrets from a Key Vault

## 0.6.0

### Minor Changes

- e6d20c9: [CES-647] Add `DELETE /tasks/{id}` operation

### Patch Changes

- 3731a72: Add Terraform modules lock file

## 0.5.0

### Minor Changes

- b8c65cf: Update APIM OpenAPI specification

## 0.4.0

### Minor Changes

- 60f49c6: [CES-641] Create `tasks` CosmosDB Container

## 0.3.0

### Minor Changes

- 23913ac: [CES-625] Update APIM configuration to let it call the Azure Function

## 0.2.4

### Patch Changes

- 3a00299: [CES-623] Create role assignement to let the Azure Function to write on CosmosDB

## 0.2.3

### Patch Changes

- b3f42f8: [CES-620] Add missing environment variables

## 0.2.2

### Patch Changes

- 77503f0: [CES-618] Add To Do API to APIM

## 0.2.1

### Patch Changes

- 1a25f4b: [CES-616] Create APIM backend to point to the To Do List API Azure Function

## 0.2.0

### Minor Changes

- 1f38d3d: [CES-540] Create a DB in the existing Cosmos account

## 0.1.1

### Patch Changes

- 0423350: Update CostCenter value

## 0.1.0

### Minor Changes

- 6359dd0: [CES-540] Create module to create CosmosDB account
- 47e80f5: Init resources package
