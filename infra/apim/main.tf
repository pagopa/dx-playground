resource "azurerm_resource_group" "test" {
  name = provider::dx::resource_name(merge(local.environment, {
    resource_type = "resource_group"
  }))
  location = local.environment.location
  tags     = local.tags
}

resource "azurerm_virtual_network" "test" {
  name = provider::dx::resource_name(merge(local.environment, {
    resource_type = "virtual_network"
  }))
  resource_group_name = azurerm_resource_group.test.name
  location            = azurerm_resource_group.test.location
  address_space       = ["10.192.0.0/16"]
  tags                = local.tags
}

resource "dx_available_subnet_cidr" "apim" {
  virtual_network_id = azurerm_virtual_network.test.id
  prefix_length      = 24
}

resource "azurerm_subnet" "apim" {
  name = provider::dx::resource_name(merge(local.environment, {
    resource_type = "apim_subnet"
  }))
  virtual_network_name = azurerm_virtual_network.test.name
  resource_group_name  = azurerm_resource_group.test.name
  address_prefixes     = [dx_available_subnet_cidr.apim.cidr_block]
}

resource "azurerm_private_dns_zone" "apim" {
  for_each = toset([
    "azure-api.net",
    "management.azure-api.net",
    "scm.azure-api.net",
  ])

  name                = each.value
  resource_group_name = azurerm_resource_group.test.name
  tags                = local.tags
}

module "apim" {
  source  = "pagopa-dx/azure-api-management/azurerm"
  version = "~> 4.2"

  environment         = local.environment
  resource_group_name = azurerm_resource_group.test.name
  tags                = local.tags

  # Developer SKU exercises subnet adoption without production-tier costs.
  use_case = "development"
  virtual_network = {
    name                = azurerm_virtual_network.test.name
    resource_group_name = azurerm_resource_group.test.name
  }
  subnet_id = azurerm_subnet.apim.id

  publisher_email           = "playground@pagopa.it"
  publisher_name            = "Playground Publisher"
  notification_sender_email = "playground@pagopa.it"

  depends_on = [azurerm_private_dns_zone.apim]
}
