# DX Playground - Dev Environment

<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_azuread"></a> [azuread](#requirement\_azuread) | ~> 3.0 |
| <a name="requirement_azurerm"></a> [azurerm](#requirement\_azurerm) | ~> 4.1 |
| <a name="requirement_dx"></a> [dx](#requirement\_dx) | ~> 0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_azuread"></a> [azuread](#provider\_azuread) | 3.7.0 |
| <a name="provider_azurerm"></a> [azurerm](#provider\_azurerm) | 4.60.0 |
| <a name="provider_dx"></a> [dx](#provider\_dx) | ~> 0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_apim"></a> [apim](#module\_apim) | pagopa-dx/azure-api-management/azurerm | ~> 2.1 |
| <a name="module_cosmos"></a> [cosmos](#module\_cosmos) | pagopa-dx/azure-cosmos-account/azurerm | ~> 0.3 |
| <a name="module_naming_convention"></a> [naming\_convention](#module\_naming\_convention) | pagopa-dx/azure-naming-convention/azurerm | ~> 0.0 |
| <a name="module_to_do_api"></a> [to\_do\_api](#module\_to\_do\_api) | ../_modules/api | n/a |
| <a name="module_to_do_api_monitoring"></a> [to\_do\_api\_monitoring](#module\_to\_do\_api\_monitoring) | ../_modules/monitoring | n/a |
| <a name="module_todo_api_function_app"></a> [todo\_api\_function\_app](#module\_todo\_api\_function\_app) | pagopa-dx/azure-function-app/azurerm | ~> 4.1 |
| <a name="module_todo_api_function_app_roles"></a> [todo\_api\_function\_app\_roles](#module\_todo\_api\_function\_app\_roles) | pagopa-dx/azure-role-assignments/azurerm | ~> 1.0 |
| <a name="module_todo_webapp_app_service"></a> [todo\_webapp\_app\_service](#module\_todo\_webapp\_app\_service) | pagopa-dx/azure-app-service/azurerm | ~> 2.0 |
| <a name="module_todo_webapp_roles"></a> [todo\_webapp\_roles](#module\_todo\_webapp\_roles) | pagopa-dx/azure-role-assignments/azurerm | ~> 1.2 |

## Resources

| Name | Type |
|------|------|
| [azurerm_cosmosdb_sql_container.tasks](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/cosmosdb_sql_container) | resource |
| [azurerm_cosmosdb_sql_database.db](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/cosmosdb_sql_database) | resource |
| [azurerm_key_vault.vault](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/key_vault) | resource |
| [azurerm_key_vault_secret.application_insights_connection_string](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/key_vault_secret) | resource |
| [azurerm_key_vault_secret.todo_webapp_apim_key](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/key_vault_secret) | resource |
| [azurerm_subnet.apim](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/subnet) | resource |
| [dx_available_subnet_cidr.next_todo_webapp_cidr](https://registry.terraform.io/providers/pagopa-dx/azure/latest/docs/resources/available_subnet_cidr) | resource |
| [dx_available_subnet_cidr.todo_api_cidr](https://registry.terraform.io/providers/pagopa-dx/azure/latest/docs/resources/available_subnet_cidr) | resource |
| [azuread_application.entra_auth_app](https://registry.terraform.io/providers/hashicorp/azuread/latest/docs/data-sources/application) | data source |
| [azuread_service_principal.apim](https://registry.terraform.io/providers/hashicorp/azuread/latest/docs/data-sources/service_principal) | data source |
| [azurerm_resource_group.net_rg](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/resource_group) | data source |
| [azurerm_subnet.pep_snet](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/subnet) | data source |
| [azurerm_subscription.current](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/subscription) | data source |
| [azurerm_virtual_network.test_vnet](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/virtual_network) | data source |

## Inputs

No inputs.

## Outputs

No outputs.
<!-- END_TF_DOCS -->
