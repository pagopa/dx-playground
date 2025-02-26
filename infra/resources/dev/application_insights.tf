module "application_insights" {
  source = "../_modules/application_insights"

  project  = "${local.environment.prefix}-${local.environment.env_short}"
  domain   = local.environment.domain
  location = local.environment.location

  resource_group_name = data.azurerm_resource_group.test_rg.name
  key_vault_id        = data.azurerm_key_vault.common_kv.id

  tags = local.tags
}
