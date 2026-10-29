resource "azurerm_api_management_backend" "backend" {
  name                = var.backend.name
  description         = var.api.description
  api_management_name = var.apim_name
  resource_group_name = var.resource_group_name
  protocol            = "http"
  url                 = var.backend.url
  resource_id         = format("https://management.azure.com%s", var.backend.target_resource_id)
}

resource "azurerm_api_management_backend" "container" {
  name                = var.container_backend.name
  description         = var.api.description
  api_management_name = var.apim_name
  resource_group_name = var.resource_group_name
  protocol            = "http"
  url                 = var.container_backend.url
  resource_id         = format("https://management.azure.com%s", var.container_backend.target_resource_id)
}
