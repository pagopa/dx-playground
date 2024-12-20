resource "azurerm_api_management_api" "api" {
  name                = var.api.name
  description         = var.api.description
  resource_group_name = var.resource_group_name
  api_management_name = var.apim_name
  revision            = "1"
  display_name        = var.api.name
  path                = var.api.path
  protocols           = ["https"]
  import {
    content_format = "openapi"
    content_value  = var.api.openapi
  }
}
