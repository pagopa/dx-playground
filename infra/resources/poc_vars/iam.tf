resource "azurerm_role_assignment" "kv_appcs" {
  scope                = azurerm_key_vault.this.id
  role_definition_name = "Key Vault Secrets Officer"
  principal_id         = azurerm_user_assigned_identity.appcs.principal_id
  description          = "Allow App Configuration to read/write Key Vault secrets"
}

resource "azurerm_role_assignment" "appcs_ca" {
  scope                = azurerm_app_configuration.this.id
  role_definition_name = "App Configuration Data Reader"
  principal_id         = azurerm_container_app.this.identity[0].principal_id
  description          = "Allow Container App to read App Configuration"
}

resource "azurerm_role_assignment" "appcs_me_contributor" {
  scope                = azurerm_app_configuration.this.id
  role_definition_name = "App Configuration Contributor"
  principal_id         = local.me
  description          = "Allow me to manage App Configuration"
}

resource "azurerm_role_assignment" "appcs_me_data_owner" {
  scope                = azurerm_app_configuration.this.id
  role_definition_name = "App Configuration Data Owner"
  principal_id         = local.me
  description          = "Allow me to manage data in App Configuration"
}
