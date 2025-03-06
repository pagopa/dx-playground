output "connection_string_secret_id" {
  value       = azurerm_key_vault_secret.ai_connection_string.versionless_id
  description = "The id of the secret containing the connection string"
}
