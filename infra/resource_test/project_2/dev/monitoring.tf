module "playground_monitoring" {
  source = "../_modules/monitoring"

  environment         = merge(local.environment, { app_name = "pgrnd" })
  resource_group_name = local.resource_group_name
  tags                = local.tags
}
