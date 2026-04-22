module "redis" {
  source = "git::https://github.com/pagopa/dx.git//infra/modules/azure_managed_redis?ref=feats/azure-managed-redis"

  environment         = merge(local.environment, { app_name = "" })
  resource_group_name = local.resource_group_name
  use_case            = "development"

  tags = local.tags
}

resource "azurerm_managed_redis_access_policy_assignment" "todo_api_function_app" {
  managed_redis_id = module.redis.id
  object_id        = module.todo_api_function_app.function_app.function_app.principal_id
}
