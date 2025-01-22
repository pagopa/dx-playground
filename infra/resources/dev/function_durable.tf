locals {
  fn_settings = {}
}

module "function_app" {
  source = "github.com/pagopa/dx//infra/modules/azure_function_app?ref=main"

  has_durable_functions = true

  environment         = merge(local.environment, { app_name = "df" })
  tier                = "s"
  resource_group_name = data.azurerm_resource_group.test_rg.name

  virtual_network = {
    name                = data.azurerm_virtual_network.test_vnet.name
    resource_group_name = data.azurerm_virtual_network.test_vnet.resource_group_name
  }

  subnet_pep_id = data.azurerm_subnet.pep_snet.id
  subnet_cidr   = "10.50.6.0/24"

  app_settings      = merge(local.fn_settings, {})
  slot_app_settings = {}

  health_check_path = "/info"

  tags = local.tags
}
