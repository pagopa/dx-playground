output "connection_string_secret_id" {
  value       = azurerm_key_vault_secret.ai_connection_string.versionless_id
  description = "The id of the secret containing the connection string"
}

output "instrumentation_key" {
  value       = azurerm_application_insights.main.instrumentation_key
  sensitive   = true
  description = "The instrumentation key of Application Insights"
}
