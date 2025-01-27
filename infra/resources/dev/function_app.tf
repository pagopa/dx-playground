locals {
  to_do_api_settings = {
    COSMOSDB_DATABASE_NAME = azurerm_cosmosdb_sql_database.db.name
    COSMOSDB_ENDPOINT      = module.cosmos.endpoint

    # Cosmos Container Names
    COSMOSDB_TASKS_CONTAINER_NAME = azurerm_cosmosdb_sql_container.tasks.name

    # Dynatrace
    DT_TENANT = "@Microsoft.KeyVault(SecretUri=${data.azurerm_key_vault_secret.dynatrace_tenant.versionless_id})"
    DT_CLUSTER_ID : "@Microsoft.KeyVault(SecretUri=${data.azurerm_key_vault_secret.dynatrace_cluster_id.versionless_id})"
    DT_CONNECTION_BASE_URL : "@Microsoft.KeyVault(SecretUri=${data.azurerm_key_vault_secret.dynatrace_target_url.versionless_id})"
    DT_CONNECTION_AUTH_TOKEN : "@Microsoft.KeyVault(SecretUri=${data.azurerm_key_vault_secret.dynatrace_connection_auth_token.versionless_id})"
  }
}

module "function_app" {
  source = "github.com/pagopa/dx//infra/modules/azure_function_app?ref=main"

  environment         = merge(local.environment, { app_name = "be" })
  tier                = "s"
  resource_group_name = data.azurerm_resource_group.test_rg.name

  virtual_network = {
    name                = data.azurerm_virtual_network.test_vnet.name
    resource_group_name = data.azurerm_virtual_network.test_vnet.resource_group_name
  }

  subnet_pep_id = data.azurerm_subnet.pep_snet.id
  subnet_cidr   = "10.50.5.0/24"

  app_settings      = merge(local.to_do_api_settings, {})
  slot_app_settings = {}

  health_check_path = "/api/info"

  tags = local.tags
}

module "func_api_role" {
  source  = "pagopa/dx-azure-role-assignments/azurerm"
  version = "~> 0.1"

  principal_id = module.function_app.function_app.function_app.principal_id

  cosmos = [
    {
      account_name        = module.cosmos.name
      resource_group_name = module.cosmos.resource_group_name
      database            = azurerm_cosmosdb_sql_database.db.name
      role                = "writer"
    }
  ]

  key_vault = [{
    name                = data.azurerm_key_vault.common_kv.name
    resource_group_name = data.azurerm_key_vault.common_kv.resource_group_name
    roles = {
      secrets = "reader"
    }
  }]
}
