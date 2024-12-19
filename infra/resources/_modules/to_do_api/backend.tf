resource "azurerm_api_management_backend" "to_do_api_be" {
  name                = var.backend.name
  description         = var.api.description
  api_management_name = var.apim_name
  resource_group_name = var.resource_group_name
  protocol            = "http"
  url                 = var.backend.url
}
