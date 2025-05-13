resource "azurerm_log_analytics_workspace" "main" {
  name                = provider::dx::resource_name(merge(local.naming_config, { resource_type = "log_analytics" }))
  location            = var.environment.location
  resource_group_name = var.resource_group_name
  sku                 = "PerGB2018"
  retention_in_days   = 30

  tags = var.tags
}

resource "azurerm_application_insights" "main" {
  name                = provider::dx::resource_name(merge(local.naming_config, { resource_type = "application_insights" }))
  location            = var.environment.location
  resource_group_name = var.resource_group_name
  application_type    = "other"

  workspace_id = azurerm_log_analytics_workspace.main.id

  tags = var.tags
}

resource "azurerm_key_vault_secret" "ai_connection_string" {
  name         = "${azurerm_application_insights.main.name}-connection-string"
  key_vault_id = var.key_vault_id
  value        = azurerm_application_insights.main.connection_string
}
