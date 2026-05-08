# DX Playground - Dev Environment

<!-- BEGIN_TF_DOCS -->

## Requirements

| Name                                                               | Version |
| ------------------------------------------------------------------ | ------- |
| <a name="requirement_azuread"></a> [azuread](#requirement_azuread) | ~> 3.0  |
| <a name="requirement_azurerm"></a> [azurerm](#requirement_azurerm) | ~> 4.58 |
| <a name="requirement_dx"></a> [dx](#requirement_dx)                | ~> 0.10 |

## Providers

| Name                                                         | Version |
| ------------------------------------------------------------ | ------- |
| <a name="provider_azuread"></a> [azuread](#provider_azuread) | 3.8.0   |
| <a name="provider_azurerm"></a> [azurerm](#provider_azurerm) | 4.70.0  |
| <a name="provider_dx"></a> [dx](#provider_dx)                | ~> 0.0  |

## Modules

| Name                                                                                                     | Source                                    | Version |
| -------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ------- |
| <a name="module_apim"></a> [apim](#module_apim)                                                          | pagopa-dx/azure-api-management/azurerm    | ~> 2.1  |
| <a name="module_cosmos"></a> [cosmos](#module_cosmos)                                                    | pagopa-dx/azure-cosmos-account/azurerm    | ~> 0.3  |
| <a name="module_naming_convention"></a> [naming_convention](#module_naming_convention)                   | pagopa-dx/azure-naming-convention/azurerm | ~> 0.0  |
| <a name="module_playground_monitoring"></a> [playground_monitoring](#module_playground_monitoring)       | ../\_modules/monitoring                   | n/a     |
| <a name="module_redis"></a> [redis](#module_redis)                                                       | pagopa-dx/azure-managed-redis/azurerm     | ~> 0.1  |
| <a name="module_to_do_api"></a> [to_do_api](#module_to_do_api)                                           | ../\_modules/api                          | n/a     |
| <a name="module_todo_api_function_app"></a> [todo_api_function_app](#module_todo_api_function_app)       | pagopa-dx/azure-function-app/azurerm      | ~> 5.0  |
| <a name="module_todo_app_service_roles"></a> [todo_app_service_roles](#module_todo_app_service_roles)    | pagopa-dx/azure-role-assignments/azurerm  | ~> 2.0  |
| <a name="module_todo_function_app_roles"></a> [todo_function_app_roles](#module_todo_function_app_roles) | pagopa-dx/azure-role-assignments/azurerm  | ~> 2.0  |
| <a name="module_todo_webapp_app_service"></a> [todo_webapp_app_service](#module_todo_webapp_app_service) | pagopa-dx/azure-app-service/azurerm       | ~> 3.0  |

## Resources

| Name                                                                                                                                                                 | Type        |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| [azurerm_cosmosdb_sql_container.tasks](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/cosmosdb_sql_container)                       | resource    |
| [azurerm_cosmosdb_sql_database.db](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/cosmosdb_sql_database)                            | resource    |
| [azurerm_key_vault.vault](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/key_vault)                                                 | resource    |
| [azurerm_key_vault_secret.application_insights_connection_string](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/key_vault_secret)  | resource    |
| [azurerm_key_vault_secret.todo_webapp_apim_key](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/key_vault_secret)                    | resource    |
| [azurerm_role_assignment.apim_to_appinsights](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/role_assignment)                       | resource    |
| [azurerm_role_assignment.app_service_monitoring_metrics_publisher](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/role_assignment)  | resource    |
| [azurerm_role_assignment.function_app_monitoring_metrics_publisher](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/role_assignment) | resource    |
| [azurerm_subnet.apim](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/subnet)                                                        | resource    |
| [dx_available_subnet_cidr.next_todo_webapp_cidr](https://registry.terraform.io/providers/pagopa-dx/azure/latest/docs/resources/available_subnet_cidr)                | resource    |
| [dx_available_subnet_cidr.todo_api_cidr](https://registry.terraform.io/providers/pagopa-dx/azure/latest/docs/resources/available_subnet_cidr)                        | resource    |
| [azuread_application.entra_auth_app](https://registry.terraform.io/providers/hashicorp/azuread/latest/docs/data-sources/application)                                 | data source |
| [azuread_service_principal.apim](https://registry.terraform.io/providers/hashicorp/azuread/latest/docs/data-sources/service_principal)                               | data source |
| [azurerm_resource_group.net_rg](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/resource_group)                                   | data source |
| [azurerm_subnet.pep_snet](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/subnet)                                                 | data source |
| [azurerm_subscription.current](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/subscription)                                      | data source |
| [azurerm_virtual_network.test_vnet](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/virtual_network)                              | data source |

## Inputs

No inputs.

## Outputs

No outputs.

<!-- END_TF_DOCS -->
