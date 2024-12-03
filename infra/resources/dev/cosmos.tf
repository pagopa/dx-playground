module "cosmos" {
  source = "github.com/pagopa/dx//infra/modules/azure_cosmos_account?ref=main"

  environment         = merge(local.environment, { app_name = "pg" })
  resource_group_name = data.azurerm_resource_group.test_rg.name

  subnet_pep_id = data.azurerm_subnet.pep_snet.id

  private_dns_zone_resource_group_name = data.azurerm_resource_group.net_rg.name

  force_public_network_access_enabled = true

  consistency_policy = {
    consistency_preset = "Default"
  }

  alerts = {
    enabled = false
  }

  tags = local.tags
}
