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
}

provider "azurerm" {
  features {
  }
  storage_use_azuread = true
}


module "azure_storage_account" {
  source  = "pagopa-dx/azure-storage-account/azurerm"
  version = "~> 2.1"

  environment         = merge(var.environment, { app_name = "test" })
  use_case            = "default"
  resource_group_name = "dx-d-itn-playground-rg-01"

  subnet_pep_id                        = data.azurerm_subnet.pep_snet.id
  private_dns_zone_resource_group_name = "dx-d-itn-network-rg-01"

  containers = [
    {
      name        = "container1"
      access_type = "private"
    },
  ]

  tags = var.tags
}
