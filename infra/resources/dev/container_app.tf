locals {
  to_do_api_settings = {
    # Cosmos DB settings
    COSMOSDB_DATABASE_NAME        = azurerm_cosmosdb_sql_database.db.name
    COSMOSDB_ENDPOINT             = module.cosmos.endpoint
    COSMOSDB_TASKS_CONTAINER_NAME = azurerm_cosmosdb_sql_container.tasks.name

    # Options to load instrumentation file with AI or Azure Monitor
    NODE_OPTIONS = "--import @pagopa/azure-tracing"

    # Application Insights settings
    APPLICATIONINSIGHTS_AUTHENTICATION_STRING = "Authorization=AAD"
    APPLICATIONINSIGHTS_ENTRA_ID_AUTH_ENABLED = "true"

    # Redis settings
    REDIS_ENDPOINT = module.redis.endpoint
  }
}

module "azure_core_values" {
  source  = "pagopa-dx/azure-core-values-exporter/azurerm"
  version = "~> 0.0"

  core_state = local.core_state
}

resource "azurerm_user_assigned_identity" "todo_container_app_key_vault" {
  name = provider::dx::resource_name(merge(local.environment, {
    app_name      = "demo-kv"
    resource_type = "managed_identity"
  }))
  location            = local.environment.location
  resource_group_name = local.resource_group_name

  tags = local.tags
}

module "playground_container_app" {
  source  = "pagopa-dx/azure-container-app/azurerm"
  version = "~> 8.0"

  environment         = merge(local.environment, { app_name = "demo" })
  resource_group_name = local.resource_group_name
  use_case            = "development"

  user_assigned_identity_id = azurerm_user_assigned_identity.todo_container_app_key_vault.id

  container_app_environment_id = module.azure_core_values.github_runner.environment_id
  container_port               = 80

  containers = [
    {
      image = "ghcr.io/pagopa/dx-playground/to-do-api:latest"
      name  = "to-do-api"

      environment_variables = [
        for name, value in merge(local.to_do_api_settings, {
          APPLICATIONINSIGHTS_CONNECTION_STRING = azurerm_key_vault_secret.application_insights_connection_string.versionless_id
          OTEL_SERVICE_NAME                     = "To Do API"
          }) : {
          name  = name
          value = value
        }
      ]

      liveness_probe = {
        path = "/api/info"
      }
    }
  ]

  autoscaler = {
    replicas = {
      minimum = 0
      maximum = 1
    }
  }

  authentication = {
    azure_active_directory = {
      client_id                     = data.azuread_application.entra_auth_app.client_id
      tenant_id                     = data.azurerm_subscription.current.tenant_id
      unauthenticated_client_action = "Return401"
      allowed_callers_client_ids    = [data.azuread_service_principal.apim.client_id]
    }
  }

  tags = local.tags

  depends_on = [module.todo_container_app_key_vault_roles]
}
