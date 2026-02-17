resource "azurerm_key_vault_secret" "todo_webapp_apim_key" {
  key_vault_id     = data.azurerm_key_vault.common_kv.id
  name             = "todo-webapp-apim-key"
  value_wo         = ""
  value_wo_version = 1
  content_type     = "The subscription key for the ToDo Web App to access the ToDo API (through APIM)"
}
