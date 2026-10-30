## To Do WebApp - App Service
module "todo_app_service_roles" {
  source  = "pagopa-dx/azure-role-assignments/azurerm"
  version = "~> 2.0"

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

resource "azurerm_role_assignment" "container_app_storage_account_contributor" {
  description          = "Allow the Container App identity to access its host storage account"
  scope                = module.todo_api_host_storage.id
  role_definition_name = "Storage Account Contributor"
  principal_id         = azurerm_user_assigned_identity.todo_container_app_key_vault.principal_id
}

resource "azurerm_role_assignment" "app_service_monitoring_metrics_publisher" {
  description          = "Allow ${module.todo_webapp_app_service.app_service.app_service.name} to publish metrics to Application Insights"
  scope                = module.playground_monitoring.application_insights_id
  role_definition_name = "Monitoring Metrics Publisher"
  principal_id         = module.todo_webapp_app_service.app_service.app_service.principal_id
}

module "todo_container_app_key_vault_roles" {
  source  = "pagopa-dx/azure-role-assignments/azurerm"
  version = "~> 2.0"

  principal_id    = azurerm_user_assigned_identity.todo_container_app_key_vault.principal_id
  subscription_id = data.azurerm_subscription.current.subscription_id

  key_vault = [{
    name                = azurerm_key_vault.vault.name
    resource_group_name = azurerm_key_vault.vault.resource_group_name
    description         = "Allow the Container App Key Vault identity to read secrets on ${azurerm_key_vault.vault.name}"
    roles = {
      secrets = "reader"
    }
  }]

  storage_blob = [{
    storage_account_name = module.todo_api_host_storage.name
    resource_group_name  = module.todo_api_host_storage.resource_group_name
    description          = "Allow the Container App identity to manage host storage blobs"
    role                 = "owner"
  }]

  storage_queue = [{
    storage_account_name = module.todo_api_host_storage.name
    resource_group_name  = module.todo_api_host_storage.resource_group_name
    description          = "Allow the Container App identity to manage host storage queues"
    role                 = "writer"
  }]
}

module "todo_container_app_roles" {
  source  = "pagopa-dx/azure-role-assignments/azurerm"
  version = "~> 2.0"

  principal_id    = module.playground_container_app.principal_id
  subscription_id = data.azurerm_subscription.current.subscription_id

  cosmos = [
    {
      account_name        = module.cosmos.name
      resource_group_name = module.cosmos.resource_group_name
      database            = azurerm_cosmosdb_sql_database.db.name
      description         = "Allow ${module.playground_container_app.name} to read and write on ${module.cosmos.name}"
      role                = "writer"
    }
  ]

  managed_redis = [{
    id          = module.redis.id
    description = "Allow ${module.playground_container_app.name} to read and write on ${module.redis.name}"
    role        = "writer"
  }]
}

resource "azurerm_role_assignment" "container_app_monitoring_metrics_publisher" {
  description          = "Allow ${module.playground_container_app.name} to publish metrics to Application Insights"
  scope                = module.playground_monitoring.application_insights_id
  role_definition_name = "Monitoring Metrics Publisher"
  principal_id         = module.playground_container_app.principal_id
}

# APIM
resource "azurerm_role_assignment" "apim_to_appinsights" {
  scope                = module.playground_monitoring.application_insights_id
  description          = "Allow ${module.apim.name} to publish metrics to Application Insights"
  role_definition_name = "Monitoring Metrics Publisher"
  principal_id         = module.apim.principal_id
}
