# Web App - App Service
module "todo_webapp_roles" {
  source  = "pagopa-dx/azure-role-assignments/azurerm"
  version = "~> 1.2"

  principal_id    = module.todo_webapp_app_service.app_service.app_service.principal_id
  subscription_id = data.azurerm_subscription.current.subscription_id

  apim = [
    {
      name                = module.apim.name
      resource_group_name = module.apim.resource_group_name
      description         = "Allow ${module.todo_webapp_app_service.app_service.app_service.name} to make call to ${module.apim.name}"
      role                = "reader"
  }]

  key_vault = [{
    name                = azurerm_key_vault.vault.name
    resource_group_name = azurerm_key_vault.vault.resource_group_name
    description         = "Allow ${module.todo_webapp_app_service.app_service.app_service.name} to read secrets on ${azurerm_key_vault.vault.name}"
    roles = {
      secrets = "reader"
    }
  }]
}

resource "azurerm_role_assignment" "app_service_monitoring_metrics_publisher" {
  description          = "Allow ${module.todo_webapp_app_service.app_service.app_service.name} to publish metrics to Application Insights"
  scope                = module.playground_monitoring.application_insights_id
  role_definition_name = "Monitoring Metrics Publisher"
  principal_id         = module.todo_webapp_app_service.app_service.app_service.principal_id
}

# API - Function App
module "todo_api_function_app_roles" {
  source  = "pagopa-dx/azure-role-assignments/azurerm"
  version = "~> 1.0"

  principal_id    = module.todo_api_function_app.function_app.function_app.principal_id
  subscription_id = data.azurerm_subscription.current.subscription_id

  cosmos = [
    {
      account_name        = module.cosmos.name
      resource_group_name = module.cosmos.resource_group_name
      database            = azurerm_cosmosdb_sql_database.db.name
      description         = "Allow ${module.todo_api_function_app.function_app.function_app.name} to read and write on ${module.cosmos.name}"
      role                = "writer"
    }
  ]

  key_vault = [{
    name                = azurerm_key_vault.vault.name
    resource_group_name = azurerm_key_vault.vault.resource_group_name
    description         = "Allow ${module.todo_api_function_app.function_app.function_app.name} to read secrets on ${azurerm_key_vault.vault.name}"
    roles = {
      secrets = "reader"
    }
  }]
}

resource "azurerm_role_assignment" "function_app_monitoring_metrics_publisher" {
  description          = "Allow ${module.todo_api_function_app.function_app.function_app.name} to publish metrics to Application Insights"
  scope                = module.playground_monitoring.application_insights_id
  role_definition_name = "Monitoring Metrics Publisher"
  principal_id         = module.todo_api_function_app.function_app.function_app.principal_id
}

resource "azurerm_managed_redis_access_policy_assignment" "todo_api_function_app" {
  managed_redis_id = module.redis.id
  object_id        = module.todo_api_function_app.function_app.function_app.principal_id
}

resource "azurerm_managed_redis_access_policy_assignment" "todo_api_function_app_slot" {
  managed_redis_id = module.redis.id
  object_id        = module.todo_api_function_app.function_app.function_app.slot.principal_id
}

# APIM
resource "azurerm_role_assignment" "apim_to_appinsights" {
  scope                = module.playground_monitoring.application_insights_id
  description          = "Allow ${module.apim.name} to publish metrics to Application Insights"
  role_definition_name = "Monitoring Metrics Publisher"
  principal_id         = module.apim.principal_id
}
