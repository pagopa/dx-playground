locals {
  to_do_api = {
    name        = "To Do API"
    description = "To Do List API"
    path        = "api/v1"
  }
}

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

resource "azurerm_api_management_backend" "to_do_api_fn" {
  name                = "to-do-api-azure-function"
  description         = local.to_do_api.description
  api_management_name = module.apim.name
  resource_group_name = module.apim.resource_group_name
  protocol            = "http"
  url                 = "https://${module.function_app.function_app.function_app.default_hostname}"
}

#### API
resource "azurerm_api_management_api" "to_do_api" {
  name                = "to-do-api"
  description         = local.to_do_api.description
  resource_group_name = module.apim.resource_group_name
  api_management_name = module.apim.name
  revision            = "1"
  display_name        = local.to_do_api.name
  path                = local.to_do_api.path
  protocols           = ["https"]
  import {
    content_format = "openapi"
    content_value  = file("../../../apps/to-do-api/docs/openapi.yaml")
  }
}
