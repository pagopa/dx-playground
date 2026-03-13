ephemeral "random_password" "admin_password" {
  length = 16
}

module "postgres" {
  source = "github.com/pagopa/dx//infra/modules//azure_postgres_server?ref=refactors/postgres-module"

  tags = local.tags
  environment = {
    prefix          = local.environment.prefix
    env_short       = local.environment.env_short
    location        = local.environment.location
    app_name        = "postgres"
    instance_number = "01"
  }

  create_replica = false

  resource_group_name = local.resource_group_name
  admin_username      = "playground"
  admin_password      = ephemeral.random_password.admin_password.result

  subnet_pep_id                        = data.azurerm_subnet.pep_snet.id
  private_dns_zone_resource_group_name = data.azurerm_subnet.pep_snet.resource_group_name
}
