# @infra/resources

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
