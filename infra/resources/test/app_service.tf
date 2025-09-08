locals {
  to_do_webapp_settings = {
    API_BASE_PATH     = "v3"
    API_KEY           = "@Microsoft.KeyVault(SecretUri=${data.azurerm_key_vault_secret.apim_api_key.versionless_id})"
    OTEL_SERVICE_NAME = "To Do WebApp"
    APPINSIGHTS_INSTRUMENTATIONKEY = module.azure_function_v3_application_insights.id
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

  application_insights_connection_string   = "@Microsoft.KeyVault(SecretUri=${module.azure_function_v3_application_insights.connection_string_secret_id})"
  application_insights_sampling_percentage = 100

  tags = local.tags
}
