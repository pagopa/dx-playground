ephemeral "random_password" "admin_password" {
  length           = 15
  special          = true
  min_lower        = 1
  min_upper        = 1
  min_numeric      = 1
  min_special      = 1
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

module "postgres" {
  source  = "pagopa-dx/azure-postgres-server/azurerm"
  version = "~> 3.0"

  tags = local.tags
  environment = {
    prefix          = local.environment.prefix
    env_short       = local.environment.env_short
    location        = local.environment.location
    app_name        = "postgres"
    instance_number = "01"
  }

  create_replica = false

  resource_group_name    = local.resource_group_name
  admin_username         = "playground"
  admin_password         = ephemeral.random_password.admin_password.result
  admin_password_version = 4

  key_vault_id = azurerm_key_vault.vault.id

  subnet_pep_id                        = data.azurerm_subnet.pep_snet.id
  private_dns_zone_resource_group_name = data.azurerm_subnet.pep_snet.resource_group_name
}
