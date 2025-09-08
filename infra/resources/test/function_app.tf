locals {
  to_do_api_settings = {
    # Options to load instrumentation file with AI or Azure Monitor
    NODE_OPTIONS = "--import @pagopa/azure-tracing"
  }
  azure_function_v3_settings = {
    # Cosmos Container Names
    NODE_OPTIONS                  = "--import @pagopa/azure-tracing"
  }
}

module "function_app" {
  source  = "pagopa-dx/azure-function-app/azurerm"
  version = "~> 0"

  environment         = merge(local.environment, { app_name = "be" })
  tier                = "s"
  resource_group_name = data.azurerm_resource_group.test_rg.name

  virtual_network = {
    name                = data.azurerm_virtual_network.test_vnet.name
    resource_group_name = data.azurerm_virtual_network.test_vnet.resource_group_name
  }

  subnet_pep_id = data.azurerm_subnet.pep_snet.id
  subnet_cidr   = "10.50.5.0/24"

  app_settings      = merge(local.to_do_api_settings, {})
  slot_app_settings = {}

  health_check_path = "/api/info"

  application_insights_connection_string   = "@Microsoft.KeyVault(SecretUri=${module.azure_function_v3_application_insights.connection_string_secret_id})"
  application_insights_sampling_percentage = 100

  tags = merge(local.tags,
    { hidden-link = "https://very-sensitive-storage.blob.core.windows.net/backups/db.bak?sp=r&st=2023-11-20T21:28:11Z&se=2023-11-21T05:28:11Z&spr=https&sv=2022-11-02&sr=b&sig=VERYSECRET" }
  )
}

resource "dx_available_subnet_cidr" "function_v3_cidr" {
  virtual_network_id = data.azurerm_virtual_network.test_vnet.id
  prefix_length      = 24
}

module "azure_function_v3_function_app" {
  source  = "pagopa-dx/azure-function-app/azurerm"
  version = "~> 0"

  environment         = merge(local.environment, { app_name = "v3" })
  tier                = "s"
  resource_group_name = data.azurerm_resource_group.test_rg.name

  virtual_network = {
    name                = data.azurerm_virtual_network.test_vnet.name
    resource_group_name = data.azurerm_virtual_network.test_vnet.resource_group_name
  }

  subnet_pep_id = data.azurerm_subnet.pep_snet.id
  subnet_cidr   = dx_available_subnet_cidr.function_v3_cidr.cidr_block

  app_settings      = merge(local.azure_function_v3_settings, {})
  slot_app_settings = {}

  health_check_path = "/"

  application_insights_connection_string   = "@Microsoft.KeyVault(SecretUri=${module.azure_function_v3_application_insights.connection_string_secret_id})"
  application_insights_sampling_percentage = 100

  tags = local.tags
}
