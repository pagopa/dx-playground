resource "azurerm_key_vault" "this" {
  name                       = "${local.project}-kv-01"
  location                   = local.location
  resource_group_name        = azurerm_resource_group.this.name
  tenant_id                  = data.azurerm_client_config.current.tenant_id
  sku_name                   = "standard"
  soft_delete_retention_days = 7
  purge_protection_enabled   = false

  rbac_authorization_enabled = true

  tags = local.tags
}

resource "azurerm_key_vault_secret" "random" {
  key_vault_id = azurerm_key_vault.this.id
  name         = "random-secret"
  value        = "secret production value"
  tags         = local.tags

  depends_on = [azurerm_role_assignment.kv_me_data_owner]
}

resource "azurerm_key_vault_secret" "random_staging" {
  key_vault_id = azurerm_key_vault.this.id
  name         = "random-secret-staging"
  value        = "secret staging value"
  tags         = local.tags

  depends_on = [azurerm_role_assignment.kv_me_data_owner]
}
