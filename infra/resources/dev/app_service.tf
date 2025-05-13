locals {
  to_do_webapp_settings = {
    API_BASE_URL      = module.apim.gateway_url
    API_BASE_PATH     = "todo"
    API_KEY           = "@Microsoft.KeyVault(SecretUri=${data.azurerm_key_vault_secret.apim_api_key.versionless_id})"
    OTEL_SERVICE_NAME = "To Do WebApp"
  }
}

module "app_service" {
  source  = "pagopa-dx/azure-app-service/azurerm"
  version = "~> 0"

  environment         = merge(local.environment, { app_name = "fe" })
  tier                = "s"
  resource_group_name = data.azurerm_resource_group.test_rg.name

  virtual_network = {
    name                = data.azurerm_virtual_network.test_vnet.name
    resource_group_name = data.azurerm_virtual_network.test_vnet.resource_group_name
  }

  subnet_pep_id = data.azurerm_subnet.pep_snet.id
  subnet_cidr   = "10.50.6.0/24"

  app_settings      = merge(local.to_do_webapp_settings, {})
  slot_app_settings = {}

  health_check_path = "/"

  application_insights_connection_string   = "@Microsoft.KeyVault(SecretUri=${module.to_do_api_application_insights.connection_string_secret_id})"
  application_insights_sampling_percentage = 100

  tags = local.tags
}

module "app_service_roles" {
  source  = "pagopa-dx/azure-role-assignments/azurerm"
  version = "~> 1"

  principal_id    = module.app_service.app_service.app_service.principal_id
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
