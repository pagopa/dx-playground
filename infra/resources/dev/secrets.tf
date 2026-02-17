ephemeral "random_password" "ephemeral_subscription_key" {
  length           = 16
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "azurerm_key_vault_secret" "todo_webapp_apim_key" {
  key_vault_id     = data.azurerm_key_vault.common_kv.id
  name             = "todo-webapp-apim-key"
  value_wo         = ephemeral.random_password.ephemeral_subscription_key.result
  value_wo_version = 1
  content_type     = "The subscription key for the ToDo Web App to access the ToDo API (through APIM)"
}
