locals {
  to_do_webapp_settings = {
    API_BASE_URL      = module.apim.gateway_url
    API_BASE_PATH     = "todo"
    API_KEY           = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.todo_webapp_apim_key.versionless_id})"
    OTEL_SERVICE_NAME = "To Do WebApp"
  }
}

resource "dx_available_subnet_cidr" "next_todo_webapp_cidr" {
  virtual_network_id = data.azurerm_virtual_network.test_vnet.id
  prefix_length      = 24
}

module "todo_webapp_app_service" {
  source  = "pagopa-dx/azure-app-service/azurerm"
  version = "~> 3.0"

  node_version        = 24
  environment         = merge(local.environment, { app_name = "fe" })
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

  application_insights_connection_string   = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.application_insights_connection_string.versionless_id})"
  application_insights_sampling_percentage = 100

  tags = local.tags
}
