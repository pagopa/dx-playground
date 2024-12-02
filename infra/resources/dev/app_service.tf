module "app_service" {
  source = "github.com/pagopa/dx//infra/modules/azure_app_service_exposed?ref=main"

  environment         = local.environment
  tier                = "xs"
  resource_group_name = data.azurerm_resource_group.test_rg.name

  app_settings      = {}
  slot_app_settings = {}

  health_check_path = "/health"

  tags = local.tags
}