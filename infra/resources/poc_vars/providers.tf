terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.1"
    }
  }
}

provider "azurerm" {
  features {
    key_vault {
      purge_soft_deleted_secrets_on_destroy = false
      recover_soft_deleted_secrets          = false
    }
    app_configuration {
      purge_soft_delete_on_destroy = false
      recover_soft_deleted         = false
    }
  }
  storage_use_azuread = true
}
