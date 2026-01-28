resource "azurerm_key_vault_secret" "todo_webapp_apim_subscription_key" {
  key_vault_id = data.azurerm_key_vault.common_kv.id
  name         = "todo-webapp-apim-subscription-key"
  value        = "CHANGE_ME_TO_A_SECURE_VALUE"
  content_type = "The subscription key for the ToDo Web App to access the ToDo API (through APIM)"
  lifecycle {
    ignore_changes = [value]
  }
}
