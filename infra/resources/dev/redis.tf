module "redis" {
  source = "git::https://github.com/pagopa/dx.git//infra/modules/azure_managed_redis?ref=feats/azure-managed-redis"

  environment         = merge(local.environment, { app_name = "" })
  resource_group_name = local.resource_group_name
  use_case            = "default"

  virtual_network_id                   = data.azurerm_virtual_network.test_vnet.id
  private_dns_zone_resource_group_name = data.azurerm_resource_group.net_rg.name

  log_analytics_workspace_id = module.playground_monitoring.log_analytics_workspace_id

  tags = local.tags
}
