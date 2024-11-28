terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "<= 4.10.0"
    }
  }

  backend "azurerm" {
    resource_group_name  = "terraform-state-rg"
    storage_account_name = "tfdevdx"
    container_name       = "terraform-state"
    key                  = "dx-playground.resources.dev.italynorth.tfstate"
  }
}

provider "azurerm" {
  features {}
}

module "playground_dev_environment" {
  source       = "github.com/pagopa/dx//infra/modules/azure_core_infra?ref=a66737a485c710eeb972076fab4a0e0bd94d05ef"
  test_enabled = true
  environment  = local.environment

  tags = local.tags
}
