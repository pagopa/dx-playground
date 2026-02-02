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

module "azure_storage_account" {
  source  = "pagopa-dx/azure-storage-account/azurerm"
  version = "~> 2.0"

  environment         = local.environment
  use_case            = "default"
  resource_group_name = azurerm_resource_group.example.name

  subnet_pep_id                        = data.azurerm_subnet.pep.id
  private_dns_zone_resource_group_name = local.virtual_network.resource_group_name

  customer_managed_key = {
    enabled = false
  }

  blob_features = {
    versioning = true
    immutability_policy = {
      enabled = false
    }
  }

  force_public_network_access_enabled = false

  access_tier = "Hot"

  subservices_enabled = {
    blob = true
  }

  network_rules = {
    default_action             = "Deny"
    bypass                     = ["AzureServices"]
    ip_rules                   = ["203.0.113.0/24"]
    virtual_network_subnet_ids = [azurerm_subnet.example.id]
  }

  static_website = {
    enabled            = true
    index_document     = "index.html"
    error_404_document = "404.html"
  }

  custom_domain = {
    name          = "example.com"
    use_subdomain = true
  }

  containers = [
    {
      name = "container1"
    }
  ]

  tags = local.tags
}
