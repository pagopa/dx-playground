module "redis" {
  source = "git::https://github.com/pagopa/dx.git//infra/modules/azure_managed_redis?ref=feats/azure-managed-redis"

  environment         = merge(local.environment, { app_name = "" })
  resource_group_name = local.resource_group_name
  use_case            = "development"

  tags = local.tags
}
