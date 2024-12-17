module "app_service" {
  source = "github.com/pagopa/dx//infra/modules/azure_app_service?ref=main"

  environment         = merge(local.environment, { app_name = "fe" })
  tier                = "s"
  resource_group_name = data.azurerm_resource_group.test_rg.name

  virtual_network = {
    name                = data.azurerm_virtual_network.test_vnet.name
    resource_group_name = data.azurerm_virtual_network.test_vnet.resource_group_name
  }

  subnet_pep_id = data.azurerm_subnet.pep_snet.id
  subnet_cidr   = "10.50.6.0/24"

  app_settings      = {}
  slot_app_settings = {}

  health_check_path = "/info"

  tags = local.tags
}
