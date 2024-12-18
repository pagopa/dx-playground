locals {
  to_do_api_settings = {
    COSMOSDB_DATABASE_NAME = azurerm_cosmosdb_sql_database.db.name
    COSMOSDB_ENDPOINT      = module.cosmos.endpoint
  }
}

module "function_app" {
  source = "github.com/pagopa/dx//infra/modules/azure_function_app?ref=main"

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

  health_check_path = "/info"

  tags = local.tags
}
