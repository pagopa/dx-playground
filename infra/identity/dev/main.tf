terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "<= 3.117.0"
    }
  }

  backend "azurerm" {
    resource_group_name  = "terraform-state-rg"
    storage_account_name = "tfdevdx"
    container_name       = "terraform-state"
    key                  = "dx-playground.identity.dev.italynorth.tfstate"
  }
}

provider "azurerm" {
  features {}
}

module "federated_identities" {
  source = "github.com/pagopa/dx//infra/modules/azure_federated_identity_with_github?ref=19b6c8a118cdd60671d603dac87d3663089d72a7"

  prefix    = local.prefix
  env_short = local.env_short
  env       = local.env
  domain    = local.domain

  repositories = [local.repo_name]

  tags = local.tags
}

module "roles_ci" {
  source       = "github.com/pagopa/dx//infra/modules/azure_role_assignments?ref=19b6c8a118cdd60671d603dac87d3663089d72a7"
  principal_id = module.federated_identities.federated_ci_identity.id

  key_vault = [
    {
      name                = "${local.project}-${local.location_short}-common-kv-01"
      resource_group_name = "${local.project}-${local.location_short}-common-rg-01"
      roles = {
        secrets = "reader"
      }
    }
  ]
}

module "roles_cd" {
  source       = "github.com/pagopa/dx//infra/modules/azure_role_assignments?ref=19b6c8a118cdd60671d603dac87d3663089d72a7"
  principal_id = module.federated_identities.federated_cd_identity.id

  key_vault = [
    {
      name                = "${local.project}-${local.location_short}-common-kv-01"
      resource_group_name = "${local.project}-${local.location_short}-common-rg-01"
      roles = {
        secrets = "reader"
      }
    }
  ]
}
