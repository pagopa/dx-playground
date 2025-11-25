module "azure_core_values" {
  source  = "pagopa-dx/azure-core-values-exporter/azurerm"
  version = "~> 0.0"

  core_state = local.core_state
}

module "azure_bootstrap" {
  source  = "pagopa-dx/azure-github-environment-bootstrap/azurerm"
  version = "~> 3.0"

  environment = local.azure_environment

  subscription_id = data.azurerm_subscription.current.id
  tenant_id       = data.azurerm_client_config.current.tenant_id

  entraid_groups = {
    admins_object_id    = data.azuread_group.admins.object_id
    devs_object_id      = data.azuread_group.developers.object_id
    externals_object_id = data.azuread_group.externals.object_id
  }

  terraform_storage_account = {
    name                = local.tf_storage_account.name
    resource_group_name = local.tf_storage_account.resource_group_name
  }

  repository = {
    owner = "pagopa"
    name  = "dx-playground"
  }

  github_private_runner = {
    container_app_environment_id       = module.azure_core_values.github_runner.environment_id
    container_app_environment_location = local.azure_environment.location
    labels                             = []
    key_vault = {
      name                = module.azure_core_values.common_key_vault.name
      resource_group_name = module.azure_core_values.common_key_vault.resource_group_name
      use_rbac            = true
    }
  }

  pep_vnet_id                        = module.azure_core_values.common_vnet.id
  private_dns_zone_resource_group_id = module.azure_core_values.network_resource_group_id
  opex_resource_group_id             = module.azure_core_values.opex_resource_group_id

  additional_resource_group_ids = [data.azurerm_resource_group.test_workflow.id]
  tags                          = local.tags
}

resource "azurerm_role_assignment" "infra_ci" {
  scope                = module.azure_bootstrap.resource_group.id
  role_definition_name = "API Management Service Contributor"
  principal_id         = module.azure_bootstrap.identities.infra.ci.principal_id
}
