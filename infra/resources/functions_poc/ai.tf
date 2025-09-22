resource "azurerm_log_analytics_workspace" "this" {
  name                = "dx-d-itn-poc-func-log-01"
  location            = azurerm_resource_group.devandreag.location
  resource_group_name = azurerm_resource_group.devandreag.name
  sku                 = "PerGB2018"
  retention_in_days   = 30

  tags = local.tags
}

resource "azurerm_application_insights" "this" {
  name                = "dx-d-itn-poc-func-appi-01"
  location            = azurerm_resource_group.devandreag.location
  resource_group_name = azurerm_resource_group.devandreag.name
  workspace_id        = azurerm_log_analytics_workspace.this.id
  application_type    = "web"

  tags = local.tags
}
