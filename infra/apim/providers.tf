terraform {
  required_version = ">= 1.16.0, < 2.0.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.58"
    }
    dx = {
      source  = "pagopa-dx/azure"
      version = "~> 0.12"
    }
  }

  backend "local" {
    path = "terraform.tfstate"
  }
}

provider "azurerm" {
  subscription_id                 = local.subscription_id
  resource_provider_registrations = "none"
  features {}
}

provider "dx" {}
