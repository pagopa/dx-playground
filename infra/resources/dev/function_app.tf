locals {
  to_do_api_settings = {
    COSMOSDB_DATABASE_NAME = azurerm_cosmosdb_sql_database.db.name
    COSMOSDB_ENDPOINT      = module.cosmos.endpoint

    # Cosmos Container Names
    COSMOSDB_TASKS_CONTAINER_NAME = azurerm_cosmosdb_sql_container.tasks.name

    # Options to load instrumentation file with AI or Azure Monitor
    NODE_OPTIONS = "--import @pagopa/azure-tracing"

    # Application Insights settings
    APPLICATIONINSIGHTS_AUTHENTICATION_STRING = "Authorization=AAD"
    APPLICATIONINSIGHTS_ENTRA_ID_AUTH_ENABLED = "true"

    # Redis
    REDIS_ENDPOINT = module.redis.endpoint
  }
}

resource "dx_available_subnet_cidr" "todo_api_cidr" {
  virtual_network_id = data.azurerm_virtual_network.test_vnet.id
  prefix_length      = 24
}

module "todo_api_function_app" {
  source  = "pagopa-dx/azure-function-app/azurerm"
  version = "~> 5.0"

  node_version        = 24
  environment         = merge(local.environment, { app_name = "be" })
  resource_group_name = local.resource_group_name

  virtual_network = {
    name                = data.azurerm_virtual_network.test_vnet.name
    resource_group_name = data.azurerm_virtual_network.test_vnet.resource_group_name
  }

  subnet_pep_id = data.azurerm_subnet.pep_snet.id
  subnet_cidr   = dx_available_subnet_cidr.todo_api_cidr.cidr_block

  app_settings      = merge(local.to_do_api_settings, {})
  slot_app_settings = merge(local.to_do_api_settings, {})

  health_check_path = "/api/info"

  application_insights_connection_string   = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.application_insights_connection_string.versionless_id})"
  application_insights_sampling_percentage = 100

  entra_id_authentication = {
    audience_client_id = data.azuread_application.entra_auth_app.client_id
    allowed_callers_client_ids = [
      data.azuread_service_principal.apim.client_id
    ]
    tenant_id = data.azurerm_subscription.current.tenant_id
  }

  tags = local.tags
}
