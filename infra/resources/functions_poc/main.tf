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
    azapi = {
      source  = "Azure/azapi"
      version = "~> 2.6"
    }
  }
}

provider "azurerm" {
  features {
  }
  storage_use_azuread = true
}

provider "azapi" {
}

module "naming_convention" {
  source  = "pagopa-dx/azure-naming-convention/azurerm"
  version = "~> 0.0"

  environment = merge(local.environment, { app_name = "funcpoc" })
}

data "azurerm_subscription" "current" {}
