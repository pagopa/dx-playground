# DX Playground - Dev Environment

<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_azurerm"></a> [azurerm](#requirement\_azurerm) | ~> 4.1 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_azurerm"></a> [azurerm](#provider\_azurerm) | 4.21.1 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_apim"></a> [apim](#module\_apim) | github.com/pagopa/dx//infra/modules/azure_api_management | 957065490c119e5ee05c221bcb6d9217f0a36aaa |
| <a name="module_apim_roles"></a> [apim\_roles](#module\_apim\_roles) | pagopa/dx-azure-role-assignments/azurerm | ~> 0.1 |
| <a name="module_app_service"></a> [app\_service](#module\_app\_service) | github.com/pagopa/dx//infra/modules/azure_app_service | main |
| <a name="module_app_service_roles"></a> [app\_service\_roles](#module\_app\_service\_roles) | pagopa/dx-azure-role-assignments/azurerm | ~> 0.1 |
| <a name="module_application_insights"></a> [application\_insights](#module\_application\_insights) | ../_modules/application_insights | n/a |
| <a name="module_cosmos"></a> [cosmos](#module\_cosmos) | pagopa-dx/azure-cosmos-account/azurerm | ~> 0.0 |
| <a name="module_func_api_role"></a> [func\_api\_role](#module\_func\_api\_role) | pagopa-dx/azure-role-assignments/azurerm | ~> 0.1 |
| <a name="module_function_app"></a> [function\_app](#module\_function\_app) | pagopa-dx/azure-function-app/azurerm | ~> 0.2 |
| <a name="module_function_test_durable"></a> [function\_test\_durable](#module\_function\_test\_durable) | pagopa-dx/azure-function-app/azurerm | ~> 0.2 |
| <a name="module_naming_convention"></a> [naming\_convention](#module\_naming\_convention) | pagopa-dx/azure-naming-convention/azurerm | ~> 0.0 |
| <a name="module_to_do_api"></a> [to\_do\_api](#module\_to\_do\_api) | ../_modules/api | n/a |

## Resources

| Name | Type |
|------|------|
| [azurerm_api_management_named_value.to_do_api_key](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/api_management_named_value) | resource |
| [azurerm_cosmosdb_sql_container.tasks](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/cosmosdb_sql_container) | resource |
| [azurerm_cosmosdb_sql_database.db](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/cosmosdb_sql_database) | resource |
| [azurerm_subnet.apim](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/subnet) | resource |
| [azurerm_key_vault.common_kv](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/key_vault) | data source |
| [azurerm_key_vault_secret.apim_api_key](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/key_vault_secret) | data source |
| [azurerm_key_vault_secret.to_do_api_key](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/key_vault_secret) | data source |
| [azurerm_resource_group.common_rg](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/resource_group) | data source |
| [azurerm_resource_group.net_rg](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/resource_group) | data source |
| [azurerm_resource_group.test_rg](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/resource_group) | data source |
| [azurerm_subnet.pep_snet](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/subnet) | data source |
| [azurerm_virtual_network.test_vnet](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/virtual_network) | data source |

## Inputs

No inputs.

## Outputs

No outputs.
<!-- END_TF_DOCS -->
