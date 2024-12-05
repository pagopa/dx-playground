# DX Playground - Dev Environment

<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_azurerm"></a> [azurerm](#requirement\_azurerm) | <= 3.116.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_azurerm"></a> [azurerm](#provider\_azurerm) | 3.116.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_apim"></a> [apim](#module\_apim) | github.com/pagopa/dx//infra/modules/azure_api_management | main |
| <a name="module_app_service"></a> [app\_service](#module\_app\_service) | github.com/pagopa/dx//infra/modules/azure_app_service | main |
| <a name="module_cosmos"></a> [cosmos](#module\_cosmos) | github.com/pagopa/dx//infra/modules/azure_cosmos_account | main |
| <a name="module_function_app"></a> [function\_app](#module\_function\_app) | github.com/pagopa/dx//infra/modules/azure_function_app | main |
| <a name="module_naming_convention"></a> [naming\_convention](#module\_naming\_convention) | github.com/pagopa/dx//infra/modules/azure_naming_convention | main |

## Resources

| Name | Type |
|------|------|
| [azurerm_subnet.apim](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/subnet) | resource |
| [azurerm_resource_group.net_rg](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/resource_group) | data source |
| [azurerm_resource_group.test_rg](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/resource_group) | data source |
| [azurerm_subnet.pep_snet](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/subnet) | data source |
| [azurerm_virtual_network.test_vnet](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/virtual_network) | data source |

## Inputs

No inputs.

## Outputs

No outputs.
<!-- END_TF_DOCS -->
