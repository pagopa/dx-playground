module "function_app" {
  source = "github.com/pagopa/dx//infra/modules/azure_function_app_exposed?ref=main"

  environment         = local.environment
  tier                = "xs"
  resource_group_name = data.azurerm_resource_group.test_rg.name

  app_settings      = {}
  slot_app_settings = {}

  health_check_path = "/health"

  tags = local.tags
}