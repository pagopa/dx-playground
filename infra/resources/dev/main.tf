terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.1"
    }
    dx = {
      source  = "pagopa-dx/azure"
      version = "~> 0"
    }
  }

  backend "azurerm" {
    resource_group_name  = "terraform-state-rg"
    storage_account_name = "tfdevdx"
    container_name       = "terraform-state"
    key                  = "dx-playground.resources.dev.italynorth.tfstate"
  }
}

provider "azurerm" {
  features {
  }
  storage_use_azuread = true
}

module "naming_convention" {
  source  = "pagopa-dx/azure-naming-convention/azurerm"
  version = "~> 0.0"

  environment = merge(local.environment, { app_name = "pg" })
}

data "azurerm_subscription" "current" {}

#
# Storage Account
#

module "storage_account" {
  source  = "pagopa-dx/azure-storage-account/azurerm"
  version = "~> 1"

  environment = {
    prefix          = local.environment.prefix
    env_short       = local.environment.env_short
    location        = local.environment.location
    domain          = local.environment.domain
    app_name        = "unbuffered"
    instance_number = local.environment.instance_number
  }

  resource_group_name = data.azurerm_resource_group.test_rg.name

  # Use dev tier for development environment
  tier = "s"

  # Configure private endpoint integration
  subnet_pep_id                        = data.azurerm_subnet.pep_snet.id
  private_dns_zone_resource_group_name = data.azurerm_virtual_network.test_vnet.resource_group_name

  tags = local.tags
}
