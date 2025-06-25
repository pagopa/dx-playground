# DX Playground - Dev Environment

## Terraform Graph

![alt text](./graph.png)

## Inference Graph

```mermaid
graph LR
  subgraph KeyVault["Key Vault Resources"]
    KV_Common["Key Vault"]
    Secret_APIM["APIM API Key"]
    Secret_ToDo["To-Do API Key"]
    Secret_ToDoV3["To-Do API Key v3"]
  end

  subgraph ResourceGroups["Resource Groups"]
    RG_Common["Common RG"]
    RG_Network["Network RG"]
    RG_Test["Test RG"]
  end

  subgraph VirtualNetwork["Virtual Network"]
    Test_VNet["Test VNet"]
    Subnet_APIM["APIM Subnet"]
    Subnet_PEP["Private Endpoint Subnet"]
  end

  subgraph APIM["API Management Resources"]
    APIM_Core["API Management Service"]
    Cert_APIM["Certificate"]
    SubnetAssoc_APIM["APIM Subnet-NSG Association"]
    Logger_APIM["Logger"]
    Policy_APIM["Policy"]
  end

  subgraph AzureFunctionV3["Azure Function V3"]
    AFV3_Core["Function App"]
    AFV3_Insights["Application Insights"]
    AFV3_PvtEP["Private Endpoint"]
    AFV3_ServicePlan["Service Plan"]
    AFV3_Storage["Storage Account"]
  end

  subgraph StorageAccount["Storage Resources"]
    SA_Core["Main Storage Account"]
    SA_PvtEP_Blob["Blob Endpoint"]
    SA_Durable["Durable Function Storage"]
  end

  subgraph CosmosDB["CosmosDB Resources"]
    Cosmos_Core["CosmosDB Account"]
    Cosmos_Container["Tasks Container"]
    Cosmos_DB["Database"]
  end
  
  %% Key Vault Connections
  Secret_APIM --> KV_Common
  Secret_ToDo --> KV_Common
  Secret_ToDoV3 --> KV_Common

  %% Resource Group Connections
  KV_Common --> RG_Common
  Test_VNet --> RG_Network

  %% Virtual Network Connections
  Subnet_PEP --> Test_VNet
  Subnet_APIM --> Test_VNet
  
  %% APIM Connections
  APIM_Core --> RG_Test
  APIM_Core --> Subnet_APIM
  Cert_APIM --> APIM_Core
  Cert_APIM --> KV_Common
  SubnetAssoc_APIM --> Subnet_APIM
  Logger_APIM --> APIM_Core
  Policy_APIM --> APIM_Core

  %% Azure Function V3 Connections
  AFV3_Core --> Test_VNet
  AFV3_Core --> AFV3_PvtEP
  AFV3_Core --> AFV3_ServicePlan
  AFV3_Core --> AFV3_Insights
  AFV3_Core --> AFV3_Storage

  %% Storage Account Connections
  SA_Durable --> RG_Test
  SA_Core --> RG_Test
  SA_PvtEP_Blob --> SA_Core

  %% CosmosDB Connections
  Cosmos_Core --> RG_Test
  Cosmos_DB --> Cosmos_Core
  Cosmos_Container --> Cosmos_DB
  
  %% Misc Connections
  Secret_ToDo --> APIM_Core
  Secret_ToDoV3 --> APIM_Core
  KV_Common --> AFV3_Insights
  SA_Core --> AFV3_Core
```

## Ollama Graph



<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_azurerm"></a> [azurerm](#requirement\_azurerm) | ~> 4.1 |
| <a name="requirement_dx"></a> [dx](#requirement\_dx) | ~> 0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_azurerm"></a> [azurerm](#provider\_azurerm) | 4.28.0 |
| <a name="provider_dx"></a> [dx](#provider\_dx) | ~> 0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_apim"></a> [apim](#module\_apim) | pagopa-dx/azure-api-management/azurerm | ~> 1 |
| <a name="module_apim_roles"></a> [apim\_roles](#module\_apim\_roles) | pagopa-dx/azure-role-assignments/azurerm | ~> 1 |
| <a name="module_app_service"></a> [app\_service](#module\_app\_service) | pagopa-dx/azure-app-service/azurerm | ~> 0 |
| <a name="module_app_service_roles"></a> [app\_service\_roles](#module\_app\_service\_roles) | pagopa-dx/azure-role-assignments/azurerm | ~> 1 |
| <a name="module_azure_function_v3_application_insights"></a> [azure\_function\_v3\_application\_insights](#module\_azure\_function\_v3\_application\_insights) | ../_modules/application_insights | n/a |
| <a name="module_azure_function_v3_function_app"></a> [azure\_function\_v3\_function\_app](#module\_azure\_function\_v3\_function\_app) | pagopa-dx/azure-function-app/azurerm | ~> 0 |
| <a name="module_cosmos"></a> [cosmos](#module\_cosmos) | pagopa-dx/azure-cosmos-account/azurerm | ~> 0 |
| <a name="module_func_api_role"></a> [func\_api\_role](#module\_func\_api\_role) | pagopa-dx/azure-role-assignments/azurerm | ~> 1 |
| <a name="module_function_app"></a> [function\_app](#module\_function\_app) | pagopa-dx/azure-function-app/azurerm | ~> 0 |
| <a name="module_function_test_durable"></a> [function\_test\_durable](#module\_function\_test\_durable) | pagopa-dx/azure-function-app/azurerm | ~> 0.2 |
| <a name="module_function_v3_api_role"></a> [function\_v3\_api\_role](#module\_function\_v3\_api\_role) | pagopa-dx/azure-role-assignments/azurerm | ~> 1 |
| <a name="module_naming_convention"></a> [naming\_convention](#module\_naming\_convention) | pagopa-dx/azure-naming-convention/azurerm | ~> 0.0 |
| <a name="module_to_do_api"></a> [to\_do\_api](#module\_to\_do\_api) | ../_modules/api | n/a |
| <a name="module_to_do_api_application_insights"></a> [to\_do\_api\_application\_insights](#module\_to\_do\_api\_application\_insights) | ../_modules/application_insights | n/a |
| <a name="module_to_do_api_v3"></a> [to\_do\_api\_v3](#module\_to\_do\_api\_v3) | ../_modules/api | n/a |

## Resources

| Name | Type |
|------|------|
| [azurerm_api_management_named_value.to_do_api_key](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/api_management_named_value) | resource |
| [azurerm_api_management_named_value.to_do_api_key_v3](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/api_management_named_value) | resource |
| [azurerm_cosmosdb_sql_container.tasks](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/cosmosdb_sql_container) | resource |
| [azurerm_cosmosdb_sql_database.db](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/cosmosdb_sql_database) | resource |
| [azurerm_subnet.apim](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/subnet) | resource |
| [dx_available_subnet_cidr.function_v3_cidr](https://registry.terraform.io/providers/pagopa-dx/azure/latest/docs/resources/available_subnet_cidr) | resource |
| [azurerm_key_vault.common_kv](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/key_vault) | data source |
| [azurerm_key_vault_secret.apim_api_key](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/key_vault_secret) | data source |
| [azurerm_key_vault_secret.to_do_api_key](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/key_vault_secret) | data source |
| [azurerm_key_vault_secret.to_do_api_key_func_v3](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/key_vault_secret) | data source |
| [azurerm_resource_group.common_rg](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/resource_group) | data source |
| [azurerm_resource_group.net_rg](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/resource_group) | data source |
| [azurerm_resource_group.test_rg](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/resource_group) | data source |
| [azurerm_subnet.pep_snet](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/subnet) | data source |
| [azurerm_subscription.current](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/subscription) | data source |
| [azurerm_virtual_network.test_vnet](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/virtual_network) | data source |

## Inputs

No inputs.

## Outputs

No outputs.
<!-- END_TF_DOCS -->
