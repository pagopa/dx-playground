module "redis" {
  source = "git::https://github.com/pagopa/dx.git//infra/modules/azure_managed_redis?ref=feats/azure-managed-redis"

  environment         = merge(local.environment, { app_name = "" })
  resource_group_name = local.resource_group_name
  use_case            = "development"

  virtual_network = data.azurerm_virtual_network.test_vnet

  log_analytics_workspace_id = module.playground_monitoring.log_analytics_workspace_id

  tags = local.tags
}
