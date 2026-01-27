resource "azurerm_subnet" "apim" {
  name                 = "${module.naming_convention.project}-apim-snet-${local.environment.instance_number}"
  virtual_network_name = data.azurerm_virtual_network.test_vnet.name
  resource_group_name  = data.azurerm_virtual_network.test_vnet.resource_group_name
  address_prefixes     = ["10.51.21.0/24"]
}

module "apim" {
  source  = "pagopa-dx/azure-api-management/azurerm"
  version = "~> 2.1"

  environment         = merge(local.environment, { app_name = "pg" })
  resource_group_name = local.resource_group_name
  use_case            = "development"

  publisher_email = "playground@pagopa.it"
  publisher_name  = "Playground Publisher"

  virtual_network = {
    name                = data.azurerm_virtual_network.test_vnet.name
    resource_group_name = data.azurerm_virtual_network.test_vnet.resource_group_name
  }

  application_insights = {
    enabled             = true
    connection_string   = module.to_do_api_application_insights.connection_string
    id                  = module.to_do_api_application_insights.id
    sampling_percentage = 100
    verbosity           = "information"
  }

  monitoring = {
    enabled                    = true
    log_analytics_workspace_id = module.to_do_api_application_insights.log_analytics_workspace_id

    logs = {
      enabled = true
      groups  = ["allLogs", "audit"]
    }

    metrics = {
      enabled = true
    }
  }

  subnet_id                     = azurerm_subnet.apim.id
  virtual_network_type_internal = true
  enable_public_network_access  = true

  tags = local.tags
}

module "apim_roles" {
  source          = "pagopa-dx/azure-role-assignments/azurerm"
  version         = "~> 1"
  principal_id    = module.apim.principal_id
  subscription_id = data.azurerm_subscription.current.subscription_id

  key_vault = [
    {
      name                = data.azurerm_key_vault.common_kv.name
      resource_group_name = data.azurerm_key_vault.common_kv.resource_group_name
      description         = "Allow dx-playground repo to read secrets"
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
    function_key_named_value_name = azurerm_api_management_named_value.todo_api_function_key.name
  }

  apim_name           = module.apim.name
  resource_group_name = module.apim.resource_group_name

  backend = {
    name               = "to-do-api-azure-function"
    url                = "https://${module.todo_api_function_app.function_app.function_app.default_hostname}/api"
    target_resource_id = module.todo_api_function_app.function_app.function_app.id
  }
}

resource "azurerm_api_management_subscription" "key_with_tracing" {
  api_management_name = module.apim.name
  resource_group_name = module.apim.resource_group_name
  display_name        = "Subscription with Tracing Enabled"
  allow_tracing       = true
  state               = "active"
}

resource "azurerm_api_management_named_value" "todo_api_function_key" {
  api_management_name = module.apim.name
  resource_group_name = module.apim.resource_group_name
  name                = "todo-api-function-key"
  display_name        = "todo-api-function-key"
  secret              = true
  value_from_key_vault {
    secret_id = azurerm_key_vault_secret.todo_api_azure_function_key.versionless_id
  }
}
