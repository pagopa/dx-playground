locals {
  to_do_api_settings = {
    COSMOSDB_DATABASE_NAME = azurerm_cosmosdb_sql_database.db.name
    COSMOSDB_ENDPOINT      = module.cosmos.endpoint

    # Cosmos Container Names
    COSMOSDB_TASKS_CONTAINER_NAME = azurerm_cosmosdb_sql_container.tasks.name

    # Options to load instrumentation file with AI or Azure Monitor
    NODE_OPTIONS = "--import @pagopa/azure-tracing"
  }
  azure_function_v3_settings = {
    COSMOSDB_DATABASE_NAME = azurerm_cosmosdb_sql_database.db.name
    COSMOSDB_ENDPOINT      = module.cosmos.endpoint

    # Cosmos Container Names
    COSMOSDB_TASKS_CONTAINER_NAME = azurerm_cosmosdb_sql_container.tasks.name
    NODE_OPTIONS                  = "--import @pagopa/azure-tracing"
  }
}

module "function_app" {
  source  = "pagopa-dx/azure-function-app/azurerm"
  version = "~> 0.3"

  environment         = merge(local.environment, { app_name = "be" })
  tier                = "s"
  resource_group_name = local.resource_group_name

  virtual_network = {
    name                = data.azurerm_virtual_network.test_vnet.name
    resource_group_name = data.azurerm_virtual_network.test_vnet.resource_group_name
  }

  subnet_pep_id = data.azurerm_subnet.pep_snet.id
  subnet_cidr   = "10.51.25.0/24"

  app_settings      = merge(local.to_do_api_settings, {})
  slot_app_settings = {}

  health_check_path = "/api/info"

  application_insights_connection_string   = "@Microsoft.KeyVault(SecretUri=${module.azure_function_v3_application_insights.connection_string_secret_id})"
  application_insights_sampling_percentage = 100

  tags = local.tags
}

resource "dx_available_subnet_cidr" "function_v3_cidr" {
  virtual_network_id = data.azurerm_virtual_network.test_vnet.id
  prefix_length      = 24
}

module "azure_function_v3_function_app" {
  source  = "pagopa-dx/azure-function-app/azurerm"
  version = "~> 0.3"

  environment         = merge(local.environment, { app_name = "v3" })
  tier                = "s"
  resource_group_name = local.resource_group_name

  virtual_network = {
    name                = data.azurerm_virtual_network.test_vnet.name
    resource_group_name = data.azurerm_virtual_network.test_vnet.resource_group_name
  }

  subnet_pep_id = data.azurerm_subnet.pep_snet.id
  subnet_cidr   = dx_available_subnet_cidr.function_v3_cidr.cidr_block

  app_settings      = merge(local.azure_function_v3_settings, {})
  slot_app_settings = {}

  health_check_path = "/"

  application_insights_connection_string   = "@Microsoft.KeyVault(SecretUri=${module.azure_function_v3_application_insights.connection_string_secret_id})"
  application_insights_sampling_percentage = 100

  tags = local.tags
}

module "func_api_role" {
  source  = "pagopa-dx/azure-role-assignments/azurerm"
  version = "~> 1.0"

  principal_id    = module.function_app.function_app.function_app.principal_id
  subscription_id = data.azurerm_subscription.current.subscription_id

  cosmos = [
    {
      account_name        = module.cosmos.name
      resource_group_name = module.cosmos.resource_group_name
      database            = azurerm_cosmosdb_sql_database.db.name
      description         = "Allow Function App to read and write on Cosmos DB"
      role                = "writer"
    }
  ]

  key_vault = [{
    name                = data.azurerm_key_vault.common_kv.name
    resource_group_name = data.azurerm_key_vault.common_kv.resource_group_name
    description         = "Allow Function App to read secrets from Key Vault"
    roles = {
      secrets = "reader"
    }
  }]
}

module "function_v3_api_role" {
  source  = "pagopa-dx/azure-role-assignments/azurerm"
  version = "~> 1.0"

  principal_id    = module.azure_function_v3_function_app.function_app.function_app.principal_id
  subscription_id = data.azurerm_subscription.current.subscription_id

  cosmos = [
    {
      account_name        = module.cosmos.name
      resource_group_name = module.cosmos.resource_group_name
      database            = azurerm_cosmosdb_sql_database.db.name
      description         = "Allow Function App to read and write on Cosmos DB"
      role                = "writer"
    }
  ]

  key_vault = [{
    name                = data.azurerm_key_vault.common_kv.name
    resource_group_name = data.azurerm_key_vault.common_kv.resource_group_name
    description         = "Allow Function App to read secrets from Key Vault"
    roles = {
      secrets = "reader"
    }
  }]
}
