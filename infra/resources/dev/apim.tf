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

# To Do API
module "to_do_api" {
  source = "../_modules/api"

  entra_id_app_client_id = "8be7b28b-d984-480f-bf6b-5894dbd0906c"

  api = {
    name         = "to-do-api"
    display_name = "To Do API"
    description  = "API to handle a To Do list"
    path         = "todo"
    openapi      = file("${path.module}/../../../apps/to-do-api/docs/openapi.yaml")
  }

  apim_name           = module.apim.name
  resource_group_name = module.apim.resource_group_name

  backend = {
    name               = "to-do-api-azure-function"
    url                = "https://${module.todo_api_function_app.function_app.function_app.default_hostname}/api"
    target_resource_id = module.todo_api_function_app.function_app.function_app.id
  }
}
# To Do API - Without x-funcions-key header
module "to_do_api_entra_auth" {
  source = "../_modules/api"

  entra_id_app_client_id = module.todo_api_function_app_entra_auth.entra_id_authentication.entra_application_client_id

  api = {
    name         = "to-do-api-entra"
    display_name = "To Do API - Entra Auth"
    description  = "API to handle a To Do list"
    path         = "auth"
    openapi      = file("${path.module}/../../../apps/to-do-api/docs/openapi.yaml")
  }

  apim_name           = module.apim.name
  resource_group_name = module.apim.resource_group_name

  backend = {
    name               = "to-do-api-azure-function-entra-auth"
    url                = "https://${module.todo_api_function_app_entra_auth.function_app.function_app.default_hostname}/api"
    target_resource_id = module.todo_api_function_app_entra_auth.function_app.function_app.id
  }
}
