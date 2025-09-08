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
    resource_group_name  = "dx-d-itn-tfstate-rg-01"
    storage_account_name = "dxditntfstatest01"
    container_name       = "terraform-state"
    key                  = "dx-playground.resources.test.tfstate"
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
