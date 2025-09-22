resource "azurerm_load_test" "this" {
  location            = local.environment.location
  name                = "dx-d-itn-poc-func-lt-01"
  resource_group_name = azurerm_resource_group.devandreag.name

  identity { type = "SystemAssigned" }

  tags = local.tags
}
