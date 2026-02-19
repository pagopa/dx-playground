module "to_do_api_monitoring" {
  source = "../_modules/monitoring"

  environment         = merge(local.environment, { app_name = "to-do-api" })
  resource_group_name = local.resource_group_name
  tags                = local.tags
}
