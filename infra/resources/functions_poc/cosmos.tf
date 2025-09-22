resource "azurerm_cosmosdb_account" "this" {
  kind                          = "GlobalDocumentDB"
  local_authentication_disabled = true
  location                      = local.environment.location
  minimal_tls_version           = "Tls12"
  name                          = "dx-d-itn-poc-func-cosno-01"
  offer_type                    = "Standard"
  public_network_access_enabled = false
  resource_group_name           = azurerm_resource_group.devandreag.name
  tags                          = local.tags

  # capabilities {
  #   name = "EnableServerless"
  # }

  consistency_policy {
    consistency_level = "Session"
  }

  geo_location {
    failover_priority = 0
    location          = "italynorth"
    zone_redundant    = false
  }
}

resource "azurerm_cosmosdb_sql_database" "this" {
  name                = "dx-d-itn-poc-func-cosmos-01"
  resource_group_name = azurerm_resource_group.devandreag.name
  account_name        = azurerm_cosmosdb_account.this.name
}

resource "azurerm_cosmosdb_sql_container" "this" {
  name                  = "items"
  resource_group_name   = azurerm_resource_group.devandreag.name
  account_name          = azurerm_cosmosdb_account.this.name
  database_name         = azurerm_cosmosdb_sql_database.this.name
  partition_key_paths   = ["/partitionKey"]
  partition_key_version = 2

  autoscale_settings {
    max_throughput = 120000
  }

  indexing_policy {
    indexing_mode = "consistent"

    included_path {
      path = "/*"
    }

    excluded_path {
      path = "/\"_etag\"/?"
    }
  }
}

resource "azurerm_cosmosdb_sql_role_assignment" "me_role_assignment" {
  resource_group_name = azurerm_resource_group.devandreag.name
  account_name        = azurerm_cosmosdb_account.this.name
  role_definition_id  = "${azurerm_cosmosdb_account.this.id}/sqlRoleDefinitions/00000000-0000-0000-0000-000000000002"
  principal_id        = "58e3c6d6-c60a-4147-ac68-5636f50012c3"

  scope = azurerm_cosmosdb_account.this.id
}

resource "azurerm_cosmosdb_sql_role_assignment" "func_role_assignment" {
  resource_group_name = azurerm_resource_group.devandreag.name
  account_name        = azurerm_cosmosdb_account.this.name
  role_definition_id  = "${azurerm_cosmosdb_account.this.id}/sqlRoleDefinitions/00000000-0000-0000-0000-000000000002"
  principal_id        = "b8f80e11-6ea1-48d6-949b-080cad757f5d"

  scope = azurerm_cosmosdb_account.this.id
}

resource "azurerm_cosmosdb_sql_role_assignment" "func_01_role_assignment" {
  resource_group_name = azurerm_resource_group.devandreag.name
  account_name        = azurerm_cosmosdb_account.this.name
  role_definition_id  = "${azurerm_cosmosdb_account.this.id}/sqlRoleDefinitions/00000000-0000-0000-0000-000000000002"
  principal_id        = "20580df7-8926-4caf-9522-a446c8835806"

  scope = azurerm_cosmosdb_account.this.id
}

resource "azurerm_cosmosdb_sql_role_assignment" "ca_role_assignment" {
  resource_group_name = azurerm_resource_group.devandreag.name
  account_name        = azurerm_cosmosdb_account.this.name
  role_definition_id  = "${azurerm_cosmosdb_account.this.id}/sqlRoleDefinitions/00000000-0000-0000-0000-000000000002"
  principal_id        = "ceaa44e2-9cbe-4719-8dec-e314e3ddb987"

  scope = azurerm_cosmosdb_account.this.id
}

# resource "azurerm_cosmosdb_sql_role_assignment" "ca_03_role_assignment" {
#   resource_group_name = azurerm_resource_group.devandreag.name
#   account_name        = azurerm_cosmosdb_account.this.name
#   role_definition_id  = "${azurerm_cosmosdb_account.this.id}/sqlRoleDefinitions/00000000-0000-0000-0000-000000000002"
#   principal_id        = "2fa2cf5b-eb86-4720-b293-bdc543bfc989"

#   scope = azurerm_cosmosdb_account.this.id
# }

resource "azurerm_cosmosdb_sql_role_assignment" "appsvc_role_assignment" {
  resource_group_name = azurerm_resource_group.devandreag.name
  account_name        = azurerm_cosmosdb_account.this.name
  role_definition_id  = "${azurerm_cosmosdb_account.this.id}/sqlRoleDefinitions/00000000-0000-0000-0000-000000000002"
  principal_id        = "971675e0-74e6-4ce4-b3c0-9821e89c4119"

  scope = azurerm_cosmosdb_account.this.id
}

resource "azurerm_cosmosdb_sql_role_assignment" "flex_role_assignment" {
  resource_group_name = azurerm_resource_group.devandreag.name
  account_name        = azurerm_cosmosdb_account.this.name
  role_definition_id  = "${azurerm_cosmosdb_account.this.id}/sqlRoleDefinitions/00000000-0000-0000-0000-000000000002"
  principal_id        = "5ef46aeb-48b2-4e25-b163-87a8b7941192"

  scope = azurerm_cosmosdb_account.this.id
}

# module "azure-role-assignments" {
#   source  = "pagopa-dx/azure-role-assignments/azurerm"
#   version = "~> 1.2"

#   principal_id = azurerm_load_test.this.identity[0].principal_id

#   subscription_id = data.azurerm_subscription.current.subscription_id

#   cosmos = [
#     {
# account_name =
# resource_group_name =
# role =
#     }
#   ]
# }
