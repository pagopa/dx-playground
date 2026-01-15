locals {
  fn_settings = {}
}

module "function_test_durable" {
  source  = "pagopa-dx/azure-function-app/azurerm"
  version = "~> 0.2"

  has_durable_functions    = true
  application_insights_key = "app-insights-key"

  environment         = merge(local.environment, { app_name = "df" })
  tier                = "s"
  resource_group_name = local.resource_group_name

  virtual_network = {
    name                = data.azurerm_virtual_network.test_vnet.name
    resource_group_name = data.azurerm_virtual_network.test_vnet.resource_group_name
  }

  subnet_pep_id = data.azurerm_subnet.pep_snet.id
  subnet_cidr   = "10.51.27.0/24"

  app_settings      = merge(local.fn_settings, {})
  slot_app_settings = merge(local.fn_settings, {})

  health_check_path = "/info"

  tags = local.tags
}
