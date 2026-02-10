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

resource "azurerm_resource_group" "main" {
  name     = provider::dx::resource_name(merge(
    var.environment,
    {
      name          = "legacy",
      domain        = "",
      resource_type = "resource_group",
  }))
  location = var.environment.location
  tags     = var.tags
}
