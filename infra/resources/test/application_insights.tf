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

  resource_group_name = data.azurerm_resource_group.test_rg.name
  key_vault_id        = data.azurerm_key_vault.common_kv.id

  tags = local.tags
}

module "azure_function_v3_application_insights" {
  source = "../_modules/application_insights"

  environment = {
    prefix          = local.environment.prefix
    env_short       = local.environment.env_short
    location        = local.environment.location
    domain          = local.environment.domain
    app_name        = "azure-function-v3"
    instance_number = 1
  }

  resource_group_name = data.azurerm_resource_group.test_rg.name
  key_vault_id        = data.azurerm_key_vault.common_kv.id

  tags = local.tags
}
