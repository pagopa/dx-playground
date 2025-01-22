locals {
  to_do_webapp_settings = {
    API_BASE_URL  = module.apim.gateway_url
    API_BASE_PATH = "todo"
  }
}

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

  app_settings      = merge(local.to_do_webapp_settings, {})
  slot_app_settings = {}

  health_check_path = "/info"

  tags = local.tags
}

module "app_service_roles" {
  source  = "pagopa/dx-azure-role-assignments/azurerm"
  version = "~> 0.1"

  principal_id = module.app_service.app_service.app_service.principal_id

  apim = [
    {
      name                = module.apim.name
      resource_group_name = module.apim.resource_group_name
      role                = "reader"
  }]
}
