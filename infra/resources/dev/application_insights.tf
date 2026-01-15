module "to_do_api_application_insights" {
  source = "../_modules/application_insights"

  environment = {
    prefix          = local.environment.prefix
    env_short       = local.environment.env_short
    location        = local.environment.location
    domain          = local.environment.domain
    app_name        = "to-do-api"
    instance_number = 1
  }

  resource_group_name = local.resource_group_name
  key_vault_id        = data.azurerm_key_vault.common_kv.id

  tags = local.tags
}
