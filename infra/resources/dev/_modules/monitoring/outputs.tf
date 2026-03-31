output "connection_string" {
  value       = azurerm_application_insights.main.connection_string
  description = "The connection string to the Application Insights instance"
  sensitive   = true
}

output "application_insights_id" {
  value       = azurerm_application_insights.main.id
  description = "The ID of the Application Insights instance"
}

output "log_analytics_workspace_id" {
  value       = azurerm_log_analytics_workspace.main.id
  description = "The ID of the Log Analytics workspace"
}
