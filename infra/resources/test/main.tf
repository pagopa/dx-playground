data "azurerm_subnet" "pep" {
  name = provider::dx::resource_name(merge(local.naming_config, {
    domain        = null,
    name          = "pep",
    resource_type = "subnet"
  }))
  virtual_network_name = local.virtual_network.name
  resource_group_name  = local.virtual_network.resource_group_name
}

resource "azurerm_resource_group" "example" {
  name     = provider::dx::resource_name(merge(local.naming_config, { resource_type = "resource_group" }))
  location = local.environment.location
}

resource "azurerm_subnet" "example" {
  name                 = "example-subnet"
  virtual_network_name = local.virtual_network.name
  resource_group_name  = local.virtual_network.resource_group_name
  address_prefixes     = ["10.50.246.0/24"]
}

resource "azurerm_user_assigned_identity" "example" {
  name                = "example"
  resource_group_name = azurerm_resource_group.example.name
  location            = local.environment.location
}

module "apim" {
  # source  = "pagopa-dx/azure-api-management/azurerm"
  # version = "~> 2.1"
  source = "../_modules/azure_api_management"

  environment         = merge(local.environment, { app_name = "pg" })
  resource_group_name = azurerm_resource_group.example.name
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
