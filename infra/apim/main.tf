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
  source = "git::https://github.com/pagopa/dx.git//infra/modules/azure_api_management?ref=72d82774cdec98cb7ff860e6bb340b0cccb18b13"

  environment         = local.environment
  resource_group_name = azurerm_resource_group.test.name
  tags                = local.tags

  # Developer SKU exercises subnet adoption without production-tier costs.
  use_case        = "development"
  virtual_network = azurerm_virtual_network.test.id

  publisher_email = "playground@pagopa.it"
  publisher_name  = "Playground Publisher"

  # Azure's existing default hostname is already the default SSL binding.
  hostname_configuration = {
    proxy = {
      use_resource_name_as_default = true
    }
  }

  depends_on = [azurerm_private_dns_zone.apim]
}
