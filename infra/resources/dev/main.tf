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
      version = "~> 0.0"
    }
  }

  backend "azurerm" {
    resource_group_name  = "dx-d-itn-tfstate-rg-01"
    storage_account_name = "dxditntfstatest01"
    container_name       = "terraform-state"
    key                  = "dx-playground.resources.dev.tfstate"
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

resource "azurerm_resource_group" "test" {
  name     = "dx-playground-test-rg-05"
  location = "Italy North"

  tags = {
    # hidden-link = "test_tag_remove_1"
    test        = "true"
    connection_string = "test_sensible_value_1"
    password = "test_sensible_value_2"
    test_2        = "true"
  }
}
