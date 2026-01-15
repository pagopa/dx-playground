locals {
  to_do_webapp_settings = {
    API_BASE_URL      = module.apim.gateway_url
    API_BASE_PATH     = "v3"
    API_KEY           = "@Microsoft.KeyVault(SecretUri=${data.azurerm_key_vault_secret.apim_api_key.versionless_id})"
    OTEL_SERVICE_NAME = "To Do WebApp"
  }
}

resource "dx_available_subnet_cidr" "next_todo_webapp_cidr" {
  virtual_network_id = data.azurerm_virtual_network.test_vnet.id
  prefix_length      = 24
}

module "todo_webapp_app_service" {
  source  = "pagopa-dx/azure-app-service/azurerm"
  version = "~> 2.0"

  node_version = 22
  size         = "P1v3"

  environment         = merge(local.environment, { app_name = "fe" })
  use_case            = "default"
  resource_group_name = local.resource_group_name

  virtual_network = {
    name                = data.azurerm_virtual_network.test_vnet.name
    resource_group_name = data.azurerm_virtual_network.test_vnet.resource_group_name
  }

  subnet_pep_id = data.azurerm_subnet.pep_snet.id
  subnet_cidr   = dx_available_subnet_cidr.next_todo_webapp_cidr.cidr_block

  app_settings      = merge(local.to_do_webapp_settings, {})
  slot_app_settings = merge(local.to_do_webapp_settings, {})

  health_check_path = "/"

  application_insights_connection_string   = "@Microsoft.KeyVault(SecretUri=${module.to_do_api_application_insights.connection_string_secret_id})"
  application_insights_sampling_percentage = 100

  tags = local.tags
}

resource "dx_available_subnet_cidr" "next_cidr" {
  virtual_network_id = data.azurerm_virtual_network.test_vnet.id
  prefix_length      = 24
}

module "new_webapp_app_service" {
  source       = "pagopa-dx/azure-app-service/azurerm"
  version      = "~> 2.0"
  node_version = 22

  environment = merge(local.environment, { app_name = "test-fe" })

  use_case = "default"

  resource_group_name = local.resource_group_name

  virtual_network = {
    name                = data.azurerm_virtual_network.test_vnet.name
    resource_group_name = data.azurerm_virtual_network.test_vnet.resource_group_name
  }

  subnet_pep_id = data.azurerm_subnet.pep_snet.id
  subnet_cidr   = dx_available_subnet_cidr.next_cidr.cidr_block

  app_settings = {}

  health_check_path = "/"

  tags = local.tags
}

module "app_service_roles" {
  source  = "pagopa-dx/azure-role-assignments/azurerm"
  version = "~> 1.2"

  principal_id    = module.todo_webapp_app_service.app_service.app_service.principal_id
  subscription_id = data.azurerm_subscription.current.subscription_id

  apim = [
    {
      name                = module.apim.name
      resource_group_name = module.apim.resource_group_name
      description         = "Allow App Service to call APIM"
      role                = "reader"
  }]

  key_vault = [{
    name                = data.azurerm_key_vault.common_kv.name
    resource_group_name = data.azurerm_key_vault.common_kv.resource_group_name
    description         = "Allow App Service to read secrets from Key Vault"
    roles = {
      secrets = "reader"
    }
  }]
}
