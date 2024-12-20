# To Do API - Module

This module is responsible for creating the API and the APIM backend service for the To Do API.

<!-- BEGIN_TF_DOCS -->
## Requirements

No requirements.

## Providers

| Name | Version |
|------|---------|
| <a name="provider_azurerm"></a> [azurerm](#provider\_azurerm) | 4.14.0 |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [azurerm_api_management_api.api](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/api_management_api) | resource |
| [azurerm_api_management_api_policy.to_do_api](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/api_management_api_policy) | resource |
| [azurerm_api_management_backend.backend](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/api_management_backend) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_api"></a> [api](#input\_api) | API definition | <pre>object({<br/>    name        = string<br/>    path        = string<br/>    description = string<br/>    openapi     = string<br/>  })</pre> | n/a | yes |
| <a name="input_apim_name"></a> [apim\_name](#input\_apim\_name) | API Management instance name | `string` | n/a | yes |
| <a name="input_backend"></a> [backend](#input\_backend) | Backend API configuration | <pre>object({<br/>    name = string<br/>    url  = string<br/>  })</pre> | n/a | yes |
| <a name="input_resource_group_name"></a> [resource\_group\_name](#input\_resource\_group\_name) | Resource group name where the API Management instance is deployed | `string` | n/a | yes |

## Outputs

No outputs.
<!-- END_TF_DOCS -->