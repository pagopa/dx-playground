terraform {
  required_providers {
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
