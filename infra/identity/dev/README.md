# DX Playground - GitHub federated Managed Identities

<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_azurerm"></a> [azurerm](#requirement\_azurerm) | ~>4 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_azurerm"></a> [azurerm](#provider\_azurerm) | 4.27.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_backend_federated_identities"></a> [backend\_federated\_identities](#module\_backend\_federated\_identities) | pagopa-dx/azure-federated-identity-with-github/azurerm | 1.0.3 |
| <a name="module_federated_identities"></a> [federated\_identities](#module\_federated\_identities) | pagopa-dx/azure-federated-identity-with-github/azurerm | 1.0.3 |
| <a name="module_roles_cd"></a> [roles\_cd](#module\_roles\_cd) | pagopa-dx/azure-role-assignments/azurerm | 1.0.3 |
| <a name="module_roles_ci"></a> [roles\_ci](#module\_roles\_ci) | pagopa-dx/azure-role-assignments/azurerm | 1.0.3 |

## Resources

| Name | Type |
|------|------|
| [azurerm_resource_group.rg_identity](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group) | resource |
| [azurerm_subscription.current](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/subscription) | data source |

## Inputs

No inputs.

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_federated_app_cd_identity"></a> [federated\_app\_cd\_identity](#output\_federated\_app\_cd\_identity) | n/a |
| <a name="output_federated_cd_identity"></a> [federated\_cd\_identity](#output\_federated\_cd\_identity) | n/a |
| <a name="output_federated_ci_identity"></a> [federated\_ci\_identity](#output\_federated\_ci\_identity) | n/a |
<!-- END_TF_DOCS -->