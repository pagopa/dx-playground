# DX Playground - GitHub federated Managed Identities

<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_azurerm"></a> [azurerm](#requirement\_azurerm) | <= 3.117.0 |

## Providers

No providers.

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_backend_federated_identities"></a> [backend\_federated\_identities](#module\_backend\_federated\_identities) | pagopa/dx-azure-federated-identity-with-github/azurerm | 0.0.2 |
| <a name="module_federated_identities"></a> [federated\_identities](#module\_federated\_identities) | github.com/pagopa/dx//infra/modules/azure_federated_identity_with_github | 19b6c8a118cdd60671d603dac87d3663089d72a7 |
| <a name="module_roles_cd"></a> [roles\_cd](#module\_roles\_cd) | github.com/pagopa/dx//infra/modules/azure_role_assignments | 19b6c8a118cdd60671d603dac87d3663089d72a7 |
| <a name="module_roles_ci"></a> [roles\_ci](#module\_roles\_ci) | github.com/pagopa/dx//infra/modules/azure_role_assignments | 19b6c8a118cdd60671d603dac87d3663089d72a7 |

## Resources

No resources.

## Inputs

No inputs.

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_federated_cd_identity"></a> [federated\_cd\_identity](#output\_federated\_cd\_identity) | n/a |
| <a name="output_federated_ci_identity"></a> [federated\_ci\_identity](#output\_federated\_ci\_identity) | n/a |
<!-- END_TF_DOCS -->