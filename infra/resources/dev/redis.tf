module "redis" {
  source  = "pagopa-dx/azure-managed-redis/azurerm"
  version = "~> 0.1"

  environment         = merge(local.environment, { app_name = "" })
  resource_group_name = local.resource_group_name
  use_case            = "development"

  tags = local.tags
}
