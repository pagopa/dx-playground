resource "azurerm_subnet" "apim" {
  name                 = "${module.naming_convention.project}-apim-snet-${local.environment.instance_number}"
  virtual_network_name = data.azurerm_virtual_network.test_vnet.name
  resource_group_name  = data.azurerm_virtual_network.test_vnet.resource_group_name
  address_prefixes     = ["10.50.1.0/24"]
}

module "apim" {
  # source  = "pagopa/dx-azure-api-management/azurerm"
  # version = "~> 1.0"

  source = "github.com/pagopa/dx//infra/modules/azure_api_management?ref=c1df3fca7191bd77365181390b8d1924376c2da1"

  environment         = merge(local.environment, { app_name = "pg" })
  resource_group_name = data.azurerm_resource_group.test_rg.name
  tier                = "s"

  publisher_email = "playground@pagopa.it"
  publisher_name  = "Playground Publisher"

  virtual_network = {
    name                = data.azurerm_virtual_network.test_vnet.name
    resource_group_name = data.azurerm_virtual_network.test_vnet.resource_group_name
  }

  application_insights = {
    enabled           = true
    connection_string = module.application_insights.connection_string
  }

  subnet_id                     = azurerm_subnet.apim.id
  virtual_network_type_internal = true
  enable_public_network_access  = true

  tags = local.tags
}

resource "azurerm_monitor_diagnostic_setting" "apim_diagnostic" {
  name                       = "apim-diagnostic"
  target_resource_id         = module.apim.id
  log_analytics_workspace_id = module.application_insights.log_analytics_workspace_id
  enabled_log {
    category_group = "audit"
  }

  metric {
    category = "AllMetrics"
  }
}

module "apim_roles" {
  source       = "pagopa-dx/azure-role-assignments/azurerm"
  version      = "~> 0.1"
  principal_id = module.apim.principal_id

  key_vault = [
    {
      name                = data.azurerm_key_vault.common_kv.name
      resource_group_name = data.azurerm_key_vault.common_kv.resource_group_name
      roles = {
        secrets = "reader"
      }
    }
  ]
}

# To Do API
module "to_do_api" {
  source = "../_modules/api"

  api = {
    name                          = "to-do-api"
    display_name                  = "To Do API"
    description                   = "API to handle a To Do list"
    path                          = "todo"
    openapi                       = file("${path.module}/../../../apps/to-do-api/docs/openapi.yaml")
    function_key_named_value_name = azurerm_api_management_named_value.to_do_api_key.name
  }

  apim_name           = module.apim.name
  resource_group_name = module.apim.resource_group_name

  backend = {
    name = "to-do-api-azure-function"
    url  = "https://${module.function_app.function_app.function_app.default_hostname}"
  }
}

resource "azurerm_api_management_named_value" "to_do_api_key" {
  name                = "to-do-api-function-key"
  resource_group_name = module.apim.resource_group_name
  api_management_name = module.apim.name
  display_name        = "to-do-api-function-key"
  secret              = true
  value_from_key_vault {
    secret_id = data.azurerm_key_vault_secret.to_do_api_key.versionless_id
  }
}
