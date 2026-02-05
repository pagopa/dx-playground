module "function_v3_storage" {
  source  = "pagopa-dx/azure-storage-account/azurerm"
  version = "~> 2.0"

  resource_group_name = local.resource_group_name
  environment = {
    location        = local.environment.location
    env_short       = local.environment.env_short
    prefix          = local.environment.prefix
    instance_number = local.environment.instance_number
    app_name        = "playground-v3"
  }

  queues = [
    "tasks-queue"
  ]
  subservices_enabled = {
    queue = true
  }
  subnet_pep_id = data.azurerm_subnet.pep_snet.id
  tags          = local.tags
}
