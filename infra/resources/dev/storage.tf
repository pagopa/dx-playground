module "todo_api_host_storage" {
  source  = "pagopa-dx/azure-storage-account/azurerm"
  version = "~> 5.0"

  environment = merge(local.environment, { app_name = "to-do-host" })

  resource_group_name = local.resource_group_name
  use_case            = "development"

  force_public_network_access_enabled  = false
  subnet_pep_id                        = data.azurerm_subnet.pep_snet.id
  private_dns_zone_resource_group_name = data.azurerm_resource_group.net_rg.name

  subservices_enabled = {
    blob  = true
    queue = true
  }

  tags = local.tags
}
