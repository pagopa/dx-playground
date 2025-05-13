terraform {
  required_providers {
    dx = {
      source  = "pagopa-dx/azure"
      version = "~> 0"
    }
  }
}

provider "dx" {}
