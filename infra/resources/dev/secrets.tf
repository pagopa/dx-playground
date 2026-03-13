resource "azurerm_key_vault_secret" "todo_webapp_apim_key" {
  key_vault_id     = azurerm_key_vault.vault.id
  name             = "todo-webapp-apim-key"
  value_wo         = ""
  value_wo_version = 1
}

resource "azurerm_key_vault_secret" "application_insights_connection_string" {
  key_vault_id     = azurerm_key_vault.vault.id
  name             = "application-insights-connection-string"
  value_wo         = module.playground_monitoring.connection_string
  value_wo_version = 1
}

resource "azurerm_key_vault_secret" "db_password" {
  key_vault_id     = azurerm_key_vault.vault.id
  name             = "DB-PASSWORD"
  value_wo         = ephemeral.random_password.admin_password.result
  value_wo_version = 3
  tags = {
    ephemeral = true
  }
}
