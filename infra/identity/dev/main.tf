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

  continuos_integration = {
    enable = true
    roles = {
      subscription = [
        "Reader",
        "Reader and Data Access",
        "PagoPA IaC Reader",
        "DocumentDB Account Contributor",
        "API Management Service Contributor",
      ]
      resource_groups = {
        terraform-state-rg = [
          "Storage Blob Data Contributor"
        ]
      }
    }
  }

  tags = local.tags
}

module "backend_federated_identities" {
  source  = "pagopa-dx/azure-federated-identity-with-github/azurerm"
  version = "0.0.2"

  prefix       = local.prefix
  env_short    = local.env_short
  env          = "app-${local.env}"
  domain       = "${local.domain}-app"
  repositories = [local.repo_name]
  tags         = local.tags

  continuos_integration = { enable = false }
}

module "roles_ci" {
  source  = "pagopa-dx/azure-role-assignments/azurerm"
  version = "~> 0.1"

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

  event_hub = [
    {
      namespace_name      = "${local.project}-${local.location_short}-playground-pg-evhns-01"
      resource_group_name = "${local.project}-${local.location_short}-playground-pg-dynatrace-rg-01"
      role                = "owner"
    }
  ]
}

module "roles_cd" {
  source  = "pagopa-dx/azure-role-assignments/azurerm"
  version = "~> 0.1"

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

  event_hub = [
    {
      namespace_name      = "${local.project}-${local.location_short}-playground-pg-evhns-01"
      resource_group_name = "${local.project}-${local.location_short}-playground-pg-dynatrace-rg-01"
      role                = "owner"
    }
  ]

  storage_blob = [
    {
      storage_account_name = "dxditnplaygrounddfstfd01"
      resource_group_name  = "${local.project}-${local.location_short}-test-rg-01"
      role                 = "owner"
    },
    {
      storage_account_name = "dxditnplaygrounddfstfn01"
      resource_group_name  = "${local.project}-${local.location_short}-test-rg-01"
      role                 = "owner"
    }
  ]

  storage_queue = [
    {
      storage_account_name = "dxditnplaygrounddfstfd01"
      resource_group_name  = "${local.project}-${local.location_short}-test-rg-01"
      role                 = "owner"
    },
    {
      storage_account_name = "dxditnplaygrounddfstfn01"
      resource_group_name  = "${local.project}-${local.location_short}-test-rg-01"
      role                 = "owner"
    }
  ]

  storage_table = [
    {
      storage_account_name = "dxditnplaygrounddfstfd01"
      resource_group_name  = "${local.project}-${local.location_short}-test-rg-01"
      role                 = "owner"
    },
    {
      storage_account_name = "dxditnplaygrounddfstfn01"
      resource_group_name  = "${local.project}-${local.location_short}-test-rg-01"
      role                 = "owner"
    }
  ]
}
