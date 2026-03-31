terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.1"
    }
    azuread = {
      source  = "hashicorp/azuread"
      version = "~> 3.0"
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
    key                  = "dx-playground.dummy.dev.tfstate"
  }
}

provider "azurerm" {
  features {
  }
  storage_use_azuread = true
}

data "azurerm_subscription" "current" {}
