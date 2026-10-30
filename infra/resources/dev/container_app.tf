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

module "todo_container_app_environment" {
  source  = "pagopa-dx/azure-container-app-environment/azurerm"
  version = "~> 5.0"

  environment         = merge(local.environment, { app_name = "demo" })
  resource_group_name = local.resource_group_name
  use_case            = "development"

  log_analytics_workspace_id = module.playground_monitoring.log_analytics_workspace_id

  networking = {
    virtual_network_id                   = data.azurerm_virtual_network.test_vnet.id
    private_dns_zone_resource_group_name = data.azurerm_resource_group.net_rg.name
    public_network_access_enabled        = false
  }

  tags = local.tags
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
  # source  = "pagopa-dx/azure-container-app/azurerm"
  # version = "~> 8.0"
  source = "github.com/pagopa/dx//infra/modules/azure_container_app?ref=features/container-app-allowed-clients"

  environment         = merge(local.environment, { app_name = "demo" })
  resource_group_name = local.resource_group_name
  use_case            = "development"

  user_assigned_identity_id = azurerm_user_assigned_identity.todo_container_app_key_vault.id

  container_app_environment_id = module.todo_container_app_environment.id
  container_port               = 80

  containers = [
    {
      image = "ghcr.io/pagopa/dx-playground/to-do-api:latest"
      name  = "to-do-api"

      environment_variables = [
        for name, value in merge(local.to_do_api_settings, {
          APPLICATIONINSIGHTS_CONNECTION_STRING = azurerm_key_vault_secret.application_insights_connection_string.versionless_id
          OTEL_SERVICE_NAME                     = "To Do API"
          AzureWebJobsStorage__accountName      = module.todo_api_host_storage.name
          AzureWebJobsStorage__clientId         = azurerm_user_assigned_identity.todo_container_app_key_vault.client_id
          AzureWebJobsStorage__credential       = "managedidentity"
          AzureWebJobsStorage__queueServiceUri  = module.todo_api_host_storage.primary_queue_endpoint
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

  depends_on = [
    module.todo_container_app_key_vault_roles,
    azurerm_role_assignment.container_app_storage_account_contributor,
  ]
}
