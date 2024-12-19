resource "azurerm_subnet" "apim" {
  name                 = "${module.naming_convention.project}-apim-snet-${local.environment.instance_number}"
  virtual_network_name = data.azurerm_virtual_network.test_vnet.name
  resource_group_name  = data.azurerm_virtual_network.test_vnet.resource_group_name
  address_prefixes     = ["10.50.1.0/24"]
}

module "apim" {
  source = "github.com/pagopa/dx//infra/modules/azure_api_management?ref=main"

  environment         = merge(local.environment, { app_name = "pg" })
  resource_group_name = data.azurerm_resource_group.test_rg.name
  tier                = "s"

  publisher_email = "playground@pagopa.it"
  publisher_name  = "Playground Publisher"

  virtual_network = {
    name                = data.azurerm_virtual_network.test_vnet.name
    resource_group_name = data.azurerm_virtual_network.test_vnet.resource_group_name
  }

  subnet_id                     = azurerm_subnet.apim.id
  virtual_network_type_internal = true
  enable_public_network_access  = true

  tags = local.tags
}

# To Do API
module "to_do_api" {
  source = "../_modules/to_do_api"

  api = {
    name        = "To Do API"
    description = "To Do List API"
    path        = "todo"
    openapi     = file("${path.module}/../../../apps/to-do-api/docs/openapi.yaml")
  }

  apim_name           = module.apim.name
  resource_group_name = module.apim.resource_group_name

  backend = {
    name = "to-do-api-azure-function"
    url  = "https://${module.function_app.function_app.function_app.default_hostname}"
  }
}
