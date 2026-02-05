module "storage" {
  source  = "pagopa-dx/azure-storage-account/azurerm"
  version = "~> 2.0"

  force_public_network_access_enabled = false

  resource_group_name = local.resource_group_name
  environment         = merge(local.environment, { app_name = "pg" })

  subservices_enabled = {
    blob  = true
    queue = true
    table = true
  }
  subnet_pep_id = data.azurerm_subnet.pep_snet.id
  tags          = local.tags
}