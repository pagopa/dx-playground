module "cosmos" {
  source  = "pagopa-dx/azure-cosmos-account/azurerm"
  version = "~> 0"

  environment         = merge(local.environment, { app_name = "pg" })
  resource_group_name = data.azurerm_resource_group.test_rg.name

  subnet_pep_id = data.azurerm_subnet.pep_snet.id

  private_dns_zone_resource_group_name = data.azurerm_resource_group.net_rg.name

  force_public_network_access_enabled = false

  consistency_policy = {
    consistency_preset = "Default"
  }

  alerts = {
    enabled = false
  }

  tags = local.tags
}

### Cosmos Database
resource "azurerm_cosmosdb_sql_database" "db" {
  name                = "db"
  resource_group_name = module.cosmos.resource_group_name
  account_name        = module.cosmos.name
}

### Cosmos Containers
resource "azurerm_cosmosdb_sql_container" "tasks" {
  account_name          = module.cosmos.name
  database_name         = azurerm_cosmosdb_sql_database.db.name
  name                  = "tasks"
  resource_group_name   = module.cosmos.resource_group_name
  partition_key_paths   = ["/id"]
  partition_key_version = "2"
}
