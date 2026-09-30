module "redis" {
  source  = "pagopa-dx/azure-managed-redis/azurerm"
  version = "~> 2.0"

  environment         = merge(local.environment, { app_name = "" })
  resource_group_name = local.resource_group_name
  use_case            = "development"

  tags = local.tags
}
